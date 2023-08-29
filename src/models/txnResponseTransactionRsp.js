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
                type: DataTypes.DATEONLY,
            },
            fundCode: {
                type: DataTypes.STRING(255),
            },
            fundName: {
                type: DataTypes.TEXT(),
            },
            rtaSchemeCode: {
                type: DataTypes.STRING(255),
            },
            rtaSchemeName: {
                type: DataTypes.TEXT(),
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
                type: DataTypes.DECIMAL(17, 4),
            },
            units: {
                type: DataTypes.DECIMAL(17, 4),
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
            numberOfInstallments: {
                type: DataTypes.BIGINT(),
            },
            startDate: {
                type: DataTypes.DATEONLY,
            },
            endDate: {
                type: DataTypes.DATEONLY,
            },
            originalOrderNumber: {
                type: DataTypes.STRING(255),
            },
            currentInstallmentNumber: {
                type: DataTypes.BIGINT(),
            },
            transactionStatus: {
                type: DataTypes.STRING(255),
            },
            registrationStatus: {
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
                type: DataTypes.TEXT(),
            },
            addlColumnOne: {
                type: DataTypes.TEXT(),
            },
            addlColumnTwo: {
                type: DataTypes.TEXT(),
            },
            addlColumnThree: {
                type: DataTypes.TEXT(),
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