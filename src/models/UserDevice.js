module.exports = (sequelize, DataTypes) => {
  const userDevice = sequelize.define(
    'userDevice',
    {
      userId: {
        type: DataTypes.INTEGER
      },
      deviceType: {
        type: DataTypes.ENUM('ios', 'android')
      }
    },
    {
      underscored: true
    },
  );
  userDevice.associate = function (models) {
    userDevice.belongsTo(models.user, {
      foreignKey: 'userId', onDelete: 'cascade'
    });
  };
  return userDevice;
};
