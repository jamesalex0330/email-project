module.exports = (sequelize, DataTypes) => {
  const userCan = sequelize.define(
    "userCan",
    {
      arnCode: {
        type: DataTypes.STRING(255),
      },
      euin: {
        type: DataTypes.STRING(255),
      },
      can: {
        type: DataTypes.STRING(255),
      },
      canRegDate: {
        type: DataTypes.STRING(255),
      },
      canRegMode: {
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
      },      
      secondHolderPan: {
        type: DataTypes.STRING(255),
      },      
      secondHolderKraStatus: {
        type: DataTypes.STRING(255),
      },      
      thirdHolderPan: {
        type: DataTypes.STRING(255),
      },         
      thirdHolderKraStatus: {
        type: DataTypes.STRING(255),
      },      
      guardianPan: {
        type: DataTypes.STRING(255),
      },      
      guardianKraStatus: {
        type: DataTypes.STRING(255),
      },      
      remarks: {
        type: DataTypes.STRING(255),
      },      
      rejectReason: {
        type: DataTypes.STRING(255),
      }     
    }, {
      underscored: true,
      indexes: [
        {
          fields: ['first_holder_pan','can']
        }
      ]
    }
  );
  return userCan;
};