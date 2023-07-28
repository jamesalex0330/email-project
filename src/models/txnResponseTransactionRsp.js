module.exports = (sequelize, DataTypes) => {
    const txnResponseTransactionRsp = sequelize.define(
        "txnResponseTransactionRsp",
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
            FolioNumber: {
                type: DataTypes.STRING(100),
            },
            primaryHolderName: {
                type: DataTypes.STRING(100),
            },
            orderMode: {
                type: DataTypes.STRING(100),
            },
            ApplicationNumber: {
                type: DataTypes.STRING(100),
            },
            orderTimestamp: {
                type: DataTypes.DATE,
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
            riaCode: {
                type: DataTypes.STRING(100),
            },
            arnCode: {
                type: DataTypes.STRING(100),
            },
            subBrokerCode: {
                type: DataTypes.STRING(100),
            },
            euinCode: {
                type: DataTypes.STRING(100),
            },
            rmCode: {
                type: DataTypes.STRING(100),
            },
            withdrawalOption: {
                type: DataTypes.STRING(100),
            },
            amount: {
                type: DataTypes.NUMERIC(17, 8),
            },
            units: {
                type: DataTypes.STRING(100),
            },
            paymentMode: {
                type: DataTypes.STRING(100),
            },
            bankName: {
                type: DataTypes.STRING(100),
            },
            bankAccountNo: {
                type: DataTypes.STRING(100),
            },
            paymentReferenceNo: {
                type: DataTypes.STRING(100),
            },
            paymentStatus: {
                type: DataTypes.STRING(100),
            },
            subseqPaymentBankName: {
                type: DataTypes.STRING(100),
            },
            subseqPaymentAccountNo: {
                type: DataTypes.STRING(100),
            },
            subseqPaymentReferenceNo: {
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
                type: DataTypes.DATE,
            },
            endDate: {
                type: DataTypes.DATE,
            },
            originalOrderNumber: {
                type: DataTypes.STRING(100),
            },
            currentInstalmentNumber: {
                type: DataTypes.STRING(100),
            },
            transactionStatus: {
                type: DataTypes.STRING(100),
            },
            registrationStatus: {
                type: DataTypes.STRING(100),
            },
            price: {
                type: DataTypes.FLOAT,
            },
            responseAmount: {
                type: DataTypes.FLOAT,
            },
            responseUnits: {
                type: DataTypes.FLOAT,
            },
            valueDate: {
                type: DataTypes.DATE,
            },
            rtaRemarks: {
                type: DataTypes.DATE,
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
        indexes: [
            {
                unique: false,
                fields: ["can_number"]
            }
        ],
        underscored: true
    }
    );
    txnResponseTransactionRsp.associate = function (models) {
        txnResponseTransactionRsp.belongsTo(models.user, {
            foreignKey: "userId",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return txnResponseTransactionRsp;
};