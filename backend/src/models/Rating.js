const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'store_id',
      references: {
        model: 'stores',
        key: 'id',
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating must be at most 5' },
      },
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'store_id'],
      },
    ],
  }
);

module.exports = Rating;
