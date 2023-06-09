module.exports = (sequelize, DataTypes) => {
  const cdsHold = sequelize.define(
    "cdsHold",
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
        type: DataTypes.NUMERIC(17,8),
      },
      nav: {
        type: DataTypes.STRING(255),
      },
      navDate: {
        type: DataTypes.STRING(255),
      }

    }, {
    underscored: true,
    indexes: [
      {
        fields: ['nav','current_value','unit_holding','folio_number','can']
      }
    ]
  }
  );
  return cdsHold;
};