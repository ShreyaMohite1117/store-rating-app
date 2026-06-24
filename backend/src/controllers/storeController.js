const { Op } = require('sequelize');
const { Store, Rating, sequelize } = require('../models');

const SORTABLE_STORE_FIELDS = ['name', 'email', 'address', 'rating', 'createdAt'];

function parseSort(sortBy, order, allowedFields, fallback = 'createdAt') {
  const field = allowedFields.includes(sortBy) ? sortBy : fallback;
  const direction = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return { field, direction };
}

// POST /api/admin/stores - Admin only
async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    const existing = await Store.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'A store with this email already exists' });
    }

    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json({ store });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create store', error: err.message });
  }
}

// GET /api/admin/stores - Admin only. Filters: name, email, address. Sort: sortBy, order.
async function listStoresAdmin(req, res) {
  try {
    const { name, email, address, sortBy, order } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const { field, direction } = parseSort(sortBy, order, SORTABLE_STORE_FIELDS);
    const orderClause = field === 'rating' ? [['ratingAvg', direction]] : [[field, direction]];

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[sequelize.fn('AVG', sequelize.col('ratings.rating')), 'ratingAvg']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      order: orderClause,
      subQuery: false,
    });

    const result = stores.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      rating: s.dataValues.ratingAvg ? Number(Number(s.dataValues.ratingAvg).toFixed(2)) : null,
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
}

// GET /api/stores - Normal User. Search by name/address. Includes overall rating + own submitted rating.
async function listStoresForUser(req, res) {
  try {
    const { name, address, sortBy, order } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const { field, direction } = parseSort(sortBy, order, SORTABLE_STORE_FIELDS);
    const orderClause = field === 'rating' ? [['ratingAvg', direction]] : [[field, direction]];

    const stores = await Store.findAll({
      where,
      attributes: {
        include: [[sequelize.fn('AVG', sequelize.col('ratings.rating')), 'ratingAvg']],
      },
      include: [{ model: Rating, as: 'ratings', attributes: [] }],
      group: ['Store.id'],
      order: orderClause,
      subQuery: false,
    });

    const myRatings = await Rating.findAll({
      where: { userId: req.user.id },
      attributes: ['storeId', 'rating'],
    });
    const myRatingByStore = {};
    myRatings.forEach((r) => {
      myRatingByStore[r.storeId] = r.rating;
    });

    const result = stores.map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      overallRating: s.dataValues.ratingAvg ? Number(Number(s.dataValues.ratingAvg).toFixed(2)) : null,
      myRating: myRatingByStore[s.id] ?? null,
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list stores', error: err.message });
  }
}

module.exports = { createStore, listStoresAdmin, listStoresForUser };
