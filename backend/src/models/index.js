const sequelize = require('../config/db');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// A User (store owner) can own one Store; a Store belongs to one owner User
User.hasOne(Store, { foreignKey: 'ownerId', as: 'ownedStore' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// A Store has many Ratings; a Rating belongs to a Store
Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// A User (normal user) can submit many Ratings; a Rating belongs to a User
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
