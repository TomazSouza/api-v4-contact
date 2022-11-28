const jwt = require("jsonwebtoken");

const SECRET = "THL323&¨!@*&#(&()()&#¨&$(";

const verifyJWT = function(req, res, next) {
    const token = req.headers["x-access-token"];

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status_code: 401,
                message: "Não autorizado",
            });
        }

        req.user_id = decoded.user_id;
        next();
    });
};

module.exports = function() {
    return { jwt, verifyJWT };
};