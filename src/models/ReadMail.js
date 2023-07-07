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
        },
        {
            underscored: true
        },
    );
    return readMail;
};