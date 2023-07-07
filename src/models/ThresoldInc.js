module.exports = (sequelize, DataTypes) => {
  const thresoldInc = sequelize.define(
    "thresoldInc",
    {
      masterIncId: {
        type: DataTypes.INTEGER,
        defaultValue: null
      },
      fundCode: {
        type: DataTypes.STRING(255),
      },
      schemeCode: {
        type: DataTypes.STRING(255),
      },
      txnType: {
        type: DataTypes.STRING(13),
      },
      sysFreq: {
        type: DataTypes.STRING(255),
      },
      sysFreqOpt: {
        type: DataTypes.STRING(255),
      },
      sysDates: {
        type: DataTypes.STRING(255),
      },
      minAmt: {
        type: DataTypes.STRING(255),
      },
      maxAmt: {
        type: DataTypes.STRING(255),
      },
      multipleAmt: {
        type: DataTypes.STRING(255),
      },      
      minUnits: {
        type: DataTypes.STRING(255),
      },
      multipleUnits: {
        type: DataTypes.STRING(255),
      },
      minInst: {
        type: DataTypes.STRING(255),
      },
      maxInst: {
        type: DataTypes.STRING(255),
      },
      sysPerpetual: {
        type: DataTypes.STRING(255),
      },
      minCumAmt: {
        type: DataTypes.STRING(255),
      },
      startDate: {
        type: DataTypes.STRING(255),
      },
      endDate: {
        type: DataTypes.STRING(255),
      }    
     
    }, {
      underscored: true
    }
  );
  thresoldInc.associate = function (models) {
    thresoldInc.belongsTo(models.masterInc, {
      foreignKey: "masterIncId",
      onDelete: "cascade",
      onUpdate: "cascade",
    });   
  };
  return thresoldInc;
};