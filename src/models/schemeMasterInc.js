module.exports = (sequelize, DataTypes) => {
    const schemeMasterInc = sequelize.define(
      "schemeMasterInc",
      {
        schemeCode: {
          type: DataTypes.STRING(100),
        },
        fundCode: {
          type: DataTypes.STRING(255),
        },
        planName: {
          type: DataTypes.STRING(255),
        },
        schemeType: {
          type: DataTypes.STRING(100),
        },
        planType: {
          type: DataTypes.STRING(255),
        },
        planOpt: {
          type: DataTypes.STRING(255),
        },
        divOpt: {
          type: DataTypes.STRING(255),
        },
        amfiId: {
          type: DataTypes.STRING(255),
        },
        priIsin: {
          type: DataTypes.STRING(255),
        },
        secIsin: {
          type: DataTypes.STRING(255),
        },      
        nfoStart: {
          type: DataTypes.STRING(255),
        },
        nfoEnd: {
          type: DataTypes.STRING(255),
        },
        allotDate: {
          type: DataTypes.DATE,
        },
        reopenDate: {
          type: DataTypes.DATE,
        },
        maturityDate: {
          type: DataTypes.DATE,
          defaultValue: null
        },
        entryLoad: {
          type: DataTypes.TEXT(),
        },
        exitLoad: {
          type: DataTypes.TEXT(),
        },
        purAllowed: {
          type: DataTypes.STRING(255),
        },
        nfoAllowed: {
          type: DataTypes.STRING(255),
        },
        redeemAllowed: {
          type: DataTypes.STRING(255),
        },
        sipAllowed: {
          type: DataTypes.STRING(255),
        },
        switchOutAllowed: {
          type: DataTypes.STRING(255),
        },
        switchInAllowed: {
          type: DataTypes.STRING(255),
        },
        stpOutAllowed: {
          type: DataTypes.STRING(255),
        },
        stpInAllowed: {
          type: DataTypes.STRING(255),
        },
        swpAllowed: {
          type: DataTypes.STRING(255),
        },
        dematAllowed: {
          type: DataTypes.STRING(255),
        },
        catgId: {
          type: DataTypes.STRING(255),
        },
        schemeFlag: {
          type: DataTypes.STRING(255),
        },
        subCatgId: {
          type: DataTypes.STRING(255),
        }
      }, {
        underscored: true
      }
    );
    return schemeMasterInc;
  };