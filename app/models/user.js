const bcryptjs = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User", {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(36),
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(128),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        }, {
            tableName: "user",
            hooks: {
                beforeCreate: (user) => {
                    const salt = bcryptjs.genSaltSync();
                    user.password = bcryptjs.hashSync(user.password, salt);
                },
            },
        }
    );

    User.associate = (models) => {};

    User.prototype.isPassword = (encodedPassword, password) => {
        return bcryptjs.compareSync(password, encodedPassword);
    };

    return User;
};