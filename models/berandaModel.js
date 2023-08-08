const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Beranda = sequelize.define(
  'Beranda',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    telpon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lainnya: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Beranda;
