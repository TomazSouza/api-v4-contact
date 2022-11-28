const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const expressValidator = require("express-validator");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const consign = require("consign");

const app = express();

app.set("view engine", "ejs");
app.set("views", "./app/views");

const swaggerDocument = require('./swagger_output.json');

app.use(express.static("./app/public"));
app.use(express.static("./app/public/images"));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.use(helmet());
app.use(compression());

consign()
    .include("libs/config.js")
    .then("libs/firebaseConfig.js")
    .then("libs/db.js")
    .then("libs/auth.js")
    .then("app/routes")
    .then("app/controllers")

.into(app);

module.exports = app;