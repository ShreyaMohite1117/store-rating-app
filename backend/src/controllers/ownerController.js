const { Store, Rating, User, sequelize } = require('../models');

// GET /api/owner/dashboard - Store Owner only
async function getOwnerDashboard(req, res) {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } });

    if (!store) {
      return res.status(404).json({ message: 'No store is associated with this account yet' });
    }

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'address'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgResult = await Rating.findOne({
      where: { storeId: store.id },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      raw: true,
    });

    const averageRating = avgResult && avgResult.avgRating ? Number(Number(avgResult.avgRating).toFixed(2)) : null;

    res.json({
      store: { id: store.id, name: store.name, email: store.email, address: store.address },
      averageRating,
      raters: ratings.map((r) => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
        rating: r.rating,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load owner dashboard', error: err.message });
  }
}

module.exports = { getOwnerDashboard };
