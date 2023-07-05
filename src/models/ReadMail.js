module.exports = (sequelize, DataTypes) => {
    const ReadMail = sequelize.define(
        'ReadMail',
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
    return ReadMail;
};