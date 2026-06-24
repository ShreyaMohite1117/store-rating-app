const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: { args: [2, 6], msg: 'Name must be between 2 and 6 characters' },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Must be a valid email address' },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: { args: [0, 400], msg: 'Address must be at most 400 characters' },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'owner'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

module.exports = User;
