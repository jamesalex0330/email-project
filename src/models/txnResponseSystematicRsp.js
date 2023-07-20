module.exports = (sequelize, DataTypes) => {
    const txnResponseSystematicRsp = sequelize.define(
      "txnResponseSystematicRsp",
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
        instalmentNumber: {
          type: DataTypes.STRING(100),
        },
        transactionTypeCode: {
          type: DataTypes.STRING(100),
        },
        utrn: {
          type: DataTypes.STRING(100),
        },
        fundCode: {
          type: DataTypes.STRING(100),
        },
        rtaSchemeCode: {
          type: DataTypes.STRING(100),
        },
        folioNumber: {
          type: DataTypes.STRING(100),
        },
        paymentStatus: {
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
          type: DataTypes.DATE,
        },
        rtaRemarks: {
          type: DataTypes.STRING(100),
        },
        addlColumnOne: {
          type: DataTypes.STRING(100),
        },
        addlColumnTwo: {
          type: DataTypes.STRING(100),
        },
        addlColumnThree: {
          type: DataTypes.STRING(100),
        }
      }, {
        underscored: true,        
      }
    );
    txnResponseSystematicRsp.associate = function (models) {
      txnResponseSystematicRsp.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "cascade",
        onUpdate: "cascade",
      });   
    };
    return txnResponseSystematicRsp;
  };