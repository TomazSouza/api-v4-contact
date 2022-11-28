module.exports = function(app) {
    const verifyJWT = app.libs.auth.verifyJWT;

    app.post("/firebase/notification", function(req, res) {
        app.app.controllers.firebase.pushNotification(app, req, res);
    });
};