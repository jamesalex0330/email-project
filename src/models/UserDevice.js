module.exports = (sequelize, DataTypes) => {
  const UserDevice = sequelize.define(
    'UserDevice',
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
  UserDevice.associate = function (models) {
    UserDevice.belongsTo(models.User, {
      foreignKey: 'userId', onDelete: 'cascade'
    });
  };
  return UserDevice;
};
