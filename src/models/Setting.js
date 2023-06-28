module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define(
      'Setting',
      {
        field: {
          type: DataTypes.STRING(245)
        },
        value: {
          type: DataTypes.TEXT
        }
      },
      {
        underscored: true
      },
    );
    
    return Setting;
  };
  