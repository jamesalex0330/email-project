module.exports = (sequelize, DataTypes) => {
    const schemeThresholdInc = sequelize.define(
        "schemeThresholdInc",
        {
            schemeMasterIncId: {
                type: DataTypes.INTEGER,
                allowNull:true
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
                type: DataTypes.FLOAT,
            },
            maxAmt: {
                type: DataTypes.FLOAT,
            },
            multipleAmt: {
                type: DataTypes.FLOAT,
            },
            minUnits: {
                type: DataTypes.FLOAT,
            },
            multipleUnits: {
                type: DataTypes.FLOAT,
            },
            minInst: {
                type: DataTypes.FLOAT,
            },
            maxInst: {
                type: DataTypes.FLOAT,
            },
            sysPerpetual: {
                type: DataTypes.FLOAT,
            },
            minCumAmt: {
                type: DataTypes.FLOAT,
            },
            startDate: {
                type: DataTypes.DATE,
            },
            endDate: {
                type: DataTypes.DATE,
            }

        }, {
        underscored: true
    }
    );
    schemeThresholdInc.associate = function (models) {
        schemeThresholdInc.belongsTo(models.schemeMasterInc, {
            foreignKey: "schemeMasterIncId",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return schemeThresholdInc;
};