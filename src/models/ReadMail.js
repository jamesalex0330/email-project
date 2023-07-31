module.exports = (sequelize, DataTypes) => {
    const readMail = sequelize.define(
        'readMail',
        {
            messageId: {
                type: DataTypes.STRING(245)
            },
            subject: {
                type: DataTypes.TEXT
            },
            mail_error: {
                type: DataTypes.TEXT,
                allowNull:true
            },
        },
        {
            underscored: true
        },
    );
    return readMail;
};