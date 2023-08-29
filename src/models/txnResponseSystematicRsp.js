module.exports = (sequelize, DataTypes) => {
    const txnResponseSystematicRsp = sequelize.define(
      "txnResponseSystematicRsp",
      {
        userId: {
          type: DataTypes.INTEGER,
          defaultValue: null
        },
        orderNumber: {
          type: DataTypes.STRING(255),
        },
        orderSequenceNumber: {
          type: DataTypes.STRING(255),
        },
        instalmentNumber: {
          type: DataTypes.STRING(255),
        },
        transactionTypeCode: {
          type: DataTypes.STRING(255),
        },
        utrn: {
          type: DataTypes.STRING(255),
        },
        fundCode: {
          type: DataTypes.STRING(255),
        },
        rtaSchemeCode: {
          type: DataTypes.STRING(255),
        },
        folioNumber: {
          type: DataTypes.STRING(255),
        },
        paymentStatus: {
          type: DataTypes.STRING(255),
        },
        transactionStatus: {
          type: DataTypes.STRING(255),
        },
        price: {
          type: DataTypes.DECIMAL(17,4),
        },
        responseAmount: {
          type: DataTypes.DECIMAL(17,4),
        },
        responseUnits: {
          type: DataTypes.DECIMAL(17,4),
        },
        valueDate: {
          type: DataTypes.DATEONLY,
        },
        rtaRemarks: {
          type: DataTypes.STRING(255),
        },
        addlColumnOne: {
          type: DataTypes.STRING(255),
        },
        addlColumnTwo: {
          type: DataTypes.STRING(255),
        },
        addlColumnThree: {
          type: DataTypes.STRING(255),
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