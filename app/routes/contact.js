module.exports = function(app) {
    const verifyJWT = app.libs.auth.verifyJWT;

    app.get("/contacts/v2", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint com opção de paginação, buscar mais contatos'

        app.app.controllers.contact.searchWithPage(app, req, res);
    });

    app.post("/contact/create", verifyJWT, function(req, res) {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para cadastrar novo contato'

        app.app.controllers.contact.create(app, req, res);
    });

    app.delete("/contact/:contact_id", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para deletar contato por id'

        app.app.controllers.contact.delete(app, req, res);
    });

    app.delete("/contact/multiply", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para deletar múltiplos contatos'

        app.app.controllers.contact.deleteContactIds(app, req, res);
    });

    app.get("/contact/:contact_id", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para cadastrar novo contato'

        app.app.controllers.contact.getById(app, req, res);
    });

    app.get("/contacts", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para buscar todos contatos'

        app.app.controllers.contact.contacts(app, req, res);
    });

    app.get("/contacts/mock", (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para buscar contatos mocks'

        app.app.controllers.contact.contactsMock(app, req, res);
    });

    app.post("/contact/update/:contact_id", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para atualizar um contato'

        app.app.controllers.contact.update(app, req, res);
    });

    app.get("/contacts/filter", verifyJWT, (req, res) => {
        // #swagger.tags = ['Contact']
        // #swagger.description = 'Endpoint para filtrar contato'

        app.app.controllers.contact.search(app, req, res);
    });
};