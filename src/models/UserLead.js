module.exports = (sequelize, DataTypes) => {
  const userLead = sequelize.define(
    "userLead",
    {
      userId: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      orderNumber: {
        type: DataTypes.STRING(100),
      },
      orderSequenceNumber: {
        type: DataTypes.STRING(100),
      },
      transactionTypeCode: {
        type: DataTypes.STRING(100),
      },
      utrn: {
        type: DataTypes.STRING(100),
      },
      canNumber: {
        type: DataTypes.STRING(100),
      },
      primaryHolderName: {
        type: DataTypes.STRING(100),
      },
      orderMode: {
        type: DataTypes.STRING(100),
      },
      orderTimestamp: {
        type: DataTypes.STRING(100),
      },
      fundCode: {
        type: DataTypes.STRING(100),
      },
      fundName: {
        type: DataTypes.STRING(100),
      },
      rtaSchemeCode: {
        type: DataTypes.STRING(100),
      },
      rtaSchemeName: {
        type: DataTypes.STRING(100),
      },
      reInvestmentTag: {
        type: DataTypes.STRING(100),
      },
      arnCode: {
        type: DataTypes.STRING(100),
      },
      withdrawalOption: {
        type: DataTypes.STRING(100),
      },
      amount: {
        type: DataTypes.NUMERIC(17,8),
      },
      units: {
        type: DataTypes.STRING(100),
      },
      frequency: {
        type: DataTypes.STRING(100),
      },
      instalmentDay: {
        type: DataTypes.STRING(100),
      },
      numberofInstallments: {
        type: DataTypes.STRING(100),
      },
      startDate: {
        type: DataTypes.STRING(100),
      },
      endDate: {
        type: DataTypes.STRING(100),
      },
      originalOrderNumber: {
        type: DataTypes.STRING(100),
      },
      transactionStatus: {
        type: DataTypes.STRING(100),
      },
      price: {
        type: DataTypes.STRING(100),
      },
      responseAmount: {
        type: DataTypes.STRING(100),
      },
      responseUnits: {
        type: DataTypes.STRING(100),
      },
      valueDate: {
        type: DataTypes.STRING(100),
      },
      addColumn: {
        type: DataTypes.STRING(100),
      }
    }, {
      underscored: true,
      indexes: [
        {
          fields: ['can_number']
        }
      ]
    }
  );
  userLead.associate = function (models) {
    userLead.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "cascade",
      onUpdate: "cascade",
    });   
  };
  return userLead;
};