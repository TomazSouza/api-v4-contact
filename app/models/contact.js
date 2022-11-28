module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
        "Contact", {
            contact_id: {
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
                type: DataTypes.STRING(100),
                unique: false,
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
        }, {
            tableName: "contact",
        }
    );

    Contact.associate = (models) => {
        Contact.belongsTo(models.User, {
            foreignKey: {
                allowNull: false,
                field: "user_id",
                name: "user_id",
            },
        });
    };

    return Contact;
};