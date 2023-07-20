module.exports = (sequelize, DataTypes) => {
    const txnResponseTransactionRsp = sequelize.define(
        "txnResponseTransactionRsp",
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
            transactionTypeCode: {
                type: DataTypes.STRING(255),
            },
            utrn: {
                type: DataTypes.STRING(255),
            },
            canNumber: {
                type: DataTypes.STRING(255),
            },
            FolioNumber: {
                type: DataTypes.STRING(255),
            },
            primaryHolderName: {
                type: DataTypes.STRING(255),
            },
            orderMode: {
                type: DataTypes.STRING(255),
            },
            ApplicationNumber: {
                type: DataTypes.STRING(255),
            },
            orderTimestamp: {
                type: DataTypes.STRING(255),
            },
            fundCode: {
                type: DataTypes.STRING(255),
            },
            fundName: {
                type: DataTypes.STRING(255),
            },
            rtaSchemeCode: {
                type: DataTypes.STRING(255),
            },
            rtaSchemeName: {
                type: DataTypes.STRING(255),
            },
            reInvestmentTag: {
                type: DataTypes.STRING(255),
            },
            riaCode: {
                type: DataTypes.STRING(255),
            },
            arnCode: {
                type: DataTypes.STRING(255),
            },
            subBrokerCode: {
                type: DataTypes.STRING(255),
            },
            euinCode: {
                type: DataTypes.STRING(255),
            },
            rmCode: {
                type: DataTypes.STRING(255),
            },
            withdrawalOption: {
                type: DataTypes.STRING(255),
            },
            amount: {
                type: DataTypes.NUMERIC(17, 8),
            },
            units: {
                type: DataTypes.STRING(255),
            },
            paymentMode: {
                type: DataTypes.STRING(255),
            },
            bankName: {
                type: DataTypes.STRING(255),
            },
            bankAccountNo: {
                type: DataTypes.STRING(255),
            },
            paymentReferenceNo: {
                type: DataTypes.STRING(255),
            },
            paymentStatus: {
                type: DataTypes.STRING(255),
            },
            subseqPaymentBankName: {
                type: DataTypes.STRING(255),
            },
            subseqPaymentAccountNo: {
                type: DataTypes.STRING(255),
            },
            subseqPaymentReferenceNo: {
                type: DataTypes.STRING(255),
            },
            frequency: {
                type: DataTypes.STRING(255),
            },
            instalmentDay: {
                type: DataTypes.STRING(255),
            },
            numberofInstallments: {
                type: DataTypes.STRING(255),
            },
            startDate: {
                type: DataTypes.DATE,
            },
            endDate: {
                type: DataTypes.DATE,
            },
            originalOrderNumber: {
                type: DataTypes.STRING(255),
            },
            currentInstalmentNumber: {
                type: DataTypes.STRING(255),
            },
            transactionStatus: {
                type: DataTypes.STRING(255),
            },
            registrationStatus: {
                type: DataTypes.STRING(255),
            },
            price: {
                type: DataTypes.STRING(255),
            },
            responseAmount: {
                type: DataTypes.STRING(255),
            },
            responseUnits: {
                type: DataTypes.STRING(255),
            },
            valueDate: {
                type: DataTypes.DATE,
            },
            rtaRemarks: {
                type: DataTypes.DATE,
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