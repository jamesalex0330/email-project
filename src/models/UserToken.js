module.exports = (sequelize, DataTypes) => {
  const userTokens = sequelize.define(
    'userToken',
    {
      userId: {
        type: DataTypes.INTEGER
      },
      accessToken: {
        type: DataTypes.TEXT
      },
      deviceType: {
        type: DataTypes.ENUM('ios', 'android')
      }
    },
    {
      underscored: true
    }
  );
  userTokens.associate = function (models) {
    userTokens.belongsTo(models.user, {
      foreignKey: 'userId', onDelete: 'cascade'
    });
  };
  return userTokens;
};
