const { Store, Rating } = require('../models');

// POST /api/stores/:storeId/rating - Normal User. Creates or updates their rating (upsert).
async function submitRating(req, res) {
  try {
    const storeId = Number(req.params.storeId);
    const { rating } = req.body;

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [record, created] = await Rating.findOrCreate({
      where: { userId: req.user.id, storeId },
      defaults: { rating },
    });

    if (!created) {
      record.rating = rating;
      await record.save();
    }

    res.status(created ? 201 : 200).json({
      message: created ? 'Rating submitted' : 'Rating updated',
      rating: { storeId, rating: record.rating },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
}

module.exports = { submitRating };
