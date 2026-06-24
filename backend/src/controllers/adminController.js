const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

const SORTABLE_USER_FIELDS = ['name', 'email', 'address', 'role', 'createdAt'];
const SORTABLE_STORE_FIELDS = ['name', 'email', 'address', 'rating', 'createdAt'];

function parseSort(sortBy, order, allowedFields, fallback = 'createdAt') {
  const field = allowedFields.includes(sortBy) ? sortBy : fallback;
  const direction = String(order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return [field, direction];
}

// GET /api/admin/dashboard
async function getDashboardStats(req, res) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error: err.message });
  }
}

// POST /api/admin/users - admin can create admin, user, or owner accounts
async function createUser(req, res) {
  try {
    const { name, email, address, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, password: hashed, role: role || 'user' });

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
}

// GET /api/admin/users - list normal users and admins, with filters + sorting
// Query params: name, email, address, role, sortBy, order
async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const [field, direction] = parseSort(sortBy, order, SORTABLE_USER_FIELDS);

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
      order: [[field, direction]],
    });

    // For store owners, attach their store's average rating
    const ownerIds = users.filter((u) => u.role === 'owner').map((u) => u.id);
    let ratingByOwner = {};
    if (ownerIds.length) {
      const stores = await Store.findAll({
        where: { ownerId: { [Op.in]: ownerIds } },
        attributes: ['id', 'ownerId'],
        include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
      });
      stores.forEach((store) => {
        const ratings = store.ratings || [];
        const avg = ratings.length
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : null;
        ratingByOwner[store.ownerId] = avg ? Number(avg.toFixed(2)) : null;
      });
    }

    const result = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
      rating: u.role === 'owner' ? ratingByOwner[u.id] ?? null : null,
    }));

    res.json({ users: result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to list users', error: err.message });
  }
}

// GET /api/admin/users/:id - full detail, includes rating if Store Owner
async function getUserDetail(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let rating = null;
    if (user.role === 'owner') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const stats = await Rating.findOne({
          where: { storeId: store.id },
          attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
          raw: true,
        });
        rating = stats && stats.avgRating ? Number(Number(stats.avgRating).toFixed(2)) : null;
      }
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        rating,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load user details', error: err.message });
  }
}

module.exports = { getDashboardStats, createUser, listUsers, getUserDetail, SORTABLE_STORE_FIELDS, parseSort };
