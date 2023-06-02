import config from "../config";

module.exports = (sequelize, DataTypes) => {
  const CdsHold = sequelize.define(
    "CdsHold",
    {
      can: {
        type: DataTypes.STRING(255),
      },
      canName: {
        type: DataTypes.STRING(255),
      },
      fundCode: {
        type: DataTypes.STRING(13),
      },
      fundName: {
        type: DataTypes.STRING(255),
      },
      schemeCode: {
        type: DataTypes.STRING(255),
      },
      schemeName: {
        type: DataTypes.TEXT(),
      },
      folioNumber: {
        type: DataTypes.STRING(255),
      },
      folioCheckDigit: {
        type: DataTypes.STRING(255),
      },
      unitHolding: {
        type: DataTypes.STRING(255),
      },
      currentValue: {
        type: DataTypes.DECIMAL(20, 15),
      },
      nav: {
        type: DataTypes.STRING(255),
      },
      navDate: {
        type: DataTypes.STRING(255),
      }

    }, {
    underscored: false,
    indexes: [
      {
        fields: ['nav','currentValue','unitHolding','folioNumber','can']
      }
    ]
  }
  );
  return CdsHold;
};