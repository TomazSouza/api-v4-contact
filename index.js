const utils = require("./utils");
const http = require("http");
const fs = require("fs");
const path = require("path");
const app = require("./libs/server");
// const { Server } = require("socket.io");

const port = 8080;
//const host = process.env.host || "127.0.0.1";
const host = "146.190.48.225";

const server = http.createServer(app);

app.get("/image/:image", (req, res) => {
    var action = req.params.image;

    var filePath = path.join(__dirname + "/app/public/images", action);

    fs.exists(filePath, function(exists) {
        if (!exists) {
            res.status(404).send({ msg: "Not found" });
            return;
        }

        var ext = path.extname(action);

        var contentType = "text/plain";

        if (ext === ".png") {
            contentType = "image/png";
        }
        res.setHeader("Content-Type", contentType);
        fs.readFile(filePath, function(err, content) {
            res.send(content);
        });
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/app/views/docs-home.html");
});

app.get("/firebase/notification", (req, res) => {
    res.sendFile(__dirname + "/app/views/firebase-notification.html");
});

app.get("/contacts-pagination", (req, res) => {
    res.sendFile(__dirname + "/app/views//contacts-pagination.html");
});

app.get("/search-contact", (req, res) => {
    res.sendFile(__dirname + "/app/views/search-contact.html");
});

app.get("/firebase", (req, res) => {
    res.sendFile(__dirname + "/app/views/firebase-docs.html");
});

app.get("/create-user", (req, res) => {
    res.sendFile(__dirname + "/app/views/create-user.html");
});

app.get("/get-user", (req, res) => {
    res.sendFile(__dirname + "/app/views/get-user.html");
});

app.get("/create-contact", (req, res) => {
    res.sendFile(__dirname + "/app/views/create-contact.html");
});

app.get("/contacts-doc", (req, res) => {
    res.sendFile(__dirname + "/app/views/contacts.html");
});

app.get("/delete-contact", (req, res) => {
    res.sendFile(__dirname + "/app/views/delete-contact.html");
});

app.get("/delete-contacts", (req, res) => {
    res.sendFile(__dirname + "/app/views/delete-contacts.html");
});

app.get("/get-contact-by-id", (req, res) => {
    res.sendFile(__dirname + "/app/views/get-contact-by-id.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/app/views/login.html");
});

app.get("/update-contact", (req, res) => {
    res.sendFile(__dirname + "/app/views/update-contact.html");
});

app.get("/status", (req, res) => {
    res.status(200).send({
        message: "API On-line",
    });
});

app.libs.db.sequelize.sync().done(() => {
    server.listen(port, host);
    server.on("error", utils.onError(server));
    server.on("listening", utils.onListening(server));
});
