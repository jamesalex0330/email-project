module.exports = (sequelize, DataTypes) => {
  const userCanRegistration = sequelize.define(
    "userCanRegistration",
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
        type: DataTypes.DATEONLY,
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
        type: DataTypes.TEXT(),
      },      
      rejectReason: {
        type: DataTypes.TEXT(),
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
  return userCanRegistration;
};