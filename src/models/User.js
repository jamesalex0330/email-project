import config from "../config";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING(50),
      },
      lastName: {
        type: DataTypes.STRING(50),
      },
      email: {
        type: DataTypes.STRING(100),
      },
      phoneNumber: {
        type: DataTypes.STRING(13),
      },
      password: {
        type: DataTypes.STRING(255),
      },
      userRole: {
        type: DataTypes.STRING(50),
      },
      panCard: {
        type: DataTypes.STRING(50),
      }
    }, {
      underscored: false,
      indexes: [
        {
          fields: ['panCard']
        }
      ]
    }
  );
  return User;
};