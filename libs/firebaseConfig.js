const admin = require("firebase-admin");
const serviceAccount = require("../agendav4-73597-firebase-adminsdk-hfegi-de2ca747c7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = () => {
    return { admin };
};