module.exports = function(sequelize, DataTypes) {
    const Log = sequelize.define("log", {
        username: DataTypes.STRING,
        server: DataTypes.STRING,
        action: DataTypes.STRING
    });
  
    return Log;
  };