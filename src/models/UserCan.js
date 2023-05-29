import config from "../config";

module.exports = (sequelize, DataTypes) => {
  const UserCan = sequelize.define(
    "UserCan",
    {
      arnCode: {
        type: DataTypes.STRING(255),
      },
      EUIN: {
        type: DataTypes.STRING(255),
      },
      CAN: {
        type: DataTypes.STRING(255),
      },
      CANRegDate: {
        type: DataTypes.STRING(255),
      },
      CANRegMode: {
        type: DataTypes.STRING(255),
      },
      canStatus: {
        type: DataTypes.STRING(255),
      },
      firstHolderPan: {
        type: DataTypes.STRING(255),
      },
      firstHolderName: {
        type: DataTypes.STRING(255),
      },
      firstHolderKraStatus: {
        type: DataTypes.STRING(255),
      },
      eventRemark: {
        type: DataTypes.STRING(255),
      },
      docProof: {
        type: DataTypes.STRING(255),
      }      
    }, {
      underscored: false,
      indexes: [
        {
          fields: ['firstHolderPan','CAN']
        }
      ]
    }
  );
  return UserCan;
};