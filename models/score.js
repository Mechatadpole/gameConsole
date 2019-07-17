module.exports = function (sequelize, DataTypes) {
    return sequelize.define('score', {
        score: DataTypes.INTEGER,
        user_uname: DataTypes.STRING,
        gameName: DataTypes.STRING
    });
};