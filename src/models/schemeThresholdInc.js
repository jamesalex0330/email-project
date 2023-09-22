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
                type: DataTypes.DECIMAL(20,4),
            },
            maxAmt: {
                type: DataTypes.DECIMAL(20,4),
            },
            multipleAmt: {
                type: DataTypes.DECIMAL(17,4),
            },
            minUnits: {
                type: DataTypes.DECIMAL(17,4),
            },
            multipleUnits: {
                type: DataTypes.DECIMAL(17,4),
            },
            minInst: {
                type: DataTypes.BIGINT(),
            },
            maxInst: {
                type: DataTypes.BIGINT(),
            },
            sysPerpetual: {
                type: DataTypes.STRING(255),
            },
            minCumAmt: {
                type: DataTypes.DECIMAL(17,4),
            },
            startDate: {
                type: DataTypes.DATEONLY,
            },
            endDate: {
                type: DataTypes.DATEONLY,
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