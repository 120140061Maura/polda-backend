const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Tentang = sequelize.define(
  'Tentang',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    visi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    misi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Tentang;
