module.exports = (sequelize, DataTypes) => {
    const setting = sequelize.define(
      'setting',
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
    
    return setting;
  };
  