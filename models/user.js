module.exports = function (sequelize, DataTypes) {

    return sequelize.define('user', {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        profilePic: DataTypes.STRING
    });
};