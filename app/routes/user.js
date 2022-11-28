module.exports = function(app) {
    const verifyJWT = app.libs.auth.verifyJWT;

    app.post("/user/login", (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para login'

        app.app.controllers.user.signin(app, req, res);
    });

    app.post("/user/create", (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para cadastrar usuário.'

        app.app.controllers.user.createUser(app, req, res);
    });

    app.delete("/user/:user_id", (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para deletar um usuário.'

        app.app.controllers.user.deleteUser(app, req, res);
    });

    app.get("/user/info", verifyJWT, (req, res) => {
        // #swagger.tags = ['User']
        // #swagger.description = 'Endpoint para obter informações do usuário.'

        app.app.controllers.user.getUser(app, req, res);
    });
};