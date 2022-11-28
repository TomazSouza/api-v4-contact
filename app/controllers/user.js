const bcryptjs = require("bcryptjs");
const SECRET = "THL323&¨!@*&#(&()()&#¨&$(";
const jwtExpiresIn = "1h";

function onSuccessResponse(statusCode, message, data, isError, errors) {
    return {
        status_code: statusCode,
        message: message,
        is_error: isError,
        data: data,
        params_validation: errors,
    };
}

function onErrorResponse(statusCode, message, errors) {
    return {
        status_code: statusCode,
        message: message,
        is_error: true,
        data: [],
        params_validation: errors,
    };
}

module.exports.signin = function(app, req, res) {
    const User = app.libs.db.models.User;

    const jwt = app.libs.auth.jwt;

    req.assert("email", "Email é obrigatório").notEmpty();
    req.assert("password", "Senha é obrigatório").notEmpty();

    var erros = req.validationErrors();
    var errors = [];

    if (erros) {
        for (var i = 0; i < erros.length; i++) {
            errors.push({ param: erros[i].param, msg: erros[i].msg });
        }
        res.status(200).send(onErrorResponse(203, "Dados não foram preenchidos", errors));
        return;
    }

    let userEmail = req.body.email;
    let userPassword = req.body.password;

    var pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    var isNotValid = userEmail.match(pattern);
    if (!isNotValid) {
        const error = [{
            "msg": "Email inválido, ex de email my@email.com",
            "param": "email"
        }];

        res.status(200).send(onErrorResponse(204, "Erro com o email", error));
        return;
    }

    if (userPassword.length <= 3) {
     
        const error = [{
            "msg": "Senha deve ser maior que 3 carateres",
            "param": "password"
        }];

        res.status(200).send(onErrorResponse(205, "Falha na senha", error));
        return;
    }

    let sequelizeQuery = User.sequelize;

    sequelizeQuery
        .query("SELECT user_id, password FROM user WHERE email = :email ", {
            replacements: {
                email: userEmail,
            },
            type: sequelizeQuery.QueryTypes.SELECT,
        })
        .then((success) => {

            console.log(success);

            if (success == undefined || 
                success == null ||
                 success === [] || 
                 success.length == 0) {
                   
                res.status(200).send(onErrorResponse(207, "Usuário não está cadastrado", []));
                return;
            } 

            let pass = success[0]["password"];
            let userId = success[0]["user_id"];

            bcryptjs
                .compare(userPassword, pass)
                .then((result) => {
                    if (result) {
                        const token = jwt.sign({ user_id: userId }, SECRET, {
                            expiresIn: jwtExpiresIn,
                        });

                        res.status(200).send({
                            status_code: 201,
                            message: "Login realizado com sucesso",
                            is_error: false,
                            data: [{ token: token }],
                            params_validation: errors,
                        });
                    } else {
                        res.status(200).send({
                            status_code: 202,
                            message: "Email ou senha inválida",
                            is_error: true,
                            data: [],
                            params_validation: errors,
                        });
                    }
                })
                .catch((e) => {
                    res.status(200).send({
                        status_code: 202,
                        message: "Email ou senha inválida",
                        is_error: true,
                        data: [],
                        params_validation: errors,
                    });
                });
        })
        .catch((e) => {
            console.log(e);

            res.status(200).send({
                status_code: 500,
                message: "Falha ao tentar fazer login",
                is_error: true,
                data: [],
                params_validation: errors,
            });
        });
};

module.exports.createUser = function(app, req, res) {
    const User = app.libs.db.models.User;
    const jwt = app.libs.auth.jwt;

    req.assert("name", "Nome é obrigatório").notEmpty();
    req.assert("email", "Email é obrigatório").notEmpty();
    req.assert("password", "Senha é obrigatório").notEmpty();

    var erros = req.validationErrors();
    var errors = [];

    if (erros) {
        for (var i = 0; i < erros.length; i++) {
            errors.push({ param: erros[i].param, msg: erros[i].msg });
        }

        res.status(200).send({
            status_code: 203,
            message: "Dados não foram preenchidos",
            is_error: true,
            data: [],
            params_validation: errors,
        });
        return;
    }

    let userEmail = req.body.email;
    let userPassword = req.body.password;

    var pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    var isNotValid = userEmail.match(pattern);
    if (!isNotValid) {
        res.status(200).send({
            status_code: 203,
            message: "Erro com o email",
            is_error: true,
            data: [],
            params_validation: [{
                "msg": "Email inválido, ex de email my@email.com",
                "param": "email"
            }],
        });
        return;
    }

    if (userPassword.length <= 3) {
        res.status(200).send({
            status_code: 203,
            message: "Falha na senha",
            is_error: true,
            data: [],
            params_validation: [{
                "msg": "Senha deve ser maior que 3 carateres",
                "param": "password"
            }],
        });
        return;
    }

    User.create(req.body)
        .then((result) => {
            const token = jwt.sign({ user_id: result.user_id }, SECRET, {
                expiresIn: jwtExpiresIn,
            });

            res.status(200).json({
                status_code: 201,
                message: "Usuário salvo com sucesso!",
                is_error: false,
                data: [{ token: token }],
                params_validation: errors,
            });
        })
        .catch((e) => {
            let error = [];
          
            if (e != undefined && e.parent.code === "ER_DUP_ENTRY") {
              res.status(200).json({
                status_code: 206,
                message: "Falha ao tentar criar usuário",
                is_error: true,
                data: [],
                params_validation: [
                  {
                    "param": "email",
                    "msg": "E-mail já foi cadastrado!"
                }
                ],
              });
              return;
            }

            let statusCode = 500;
            let msgError = "Falha ao tentar salvar";
            if (error != undefined) {
                error = e.errors;
            }
            if (error != undefined && error.length > 0) {
                msgError = error[0].message;
            }
            res.status(200).json({
                status_code: statusCode,
                message: msgError,
                is_error: true,
                data: [],
                params_validation: errors,
            });
        });
};

module.exports.getUser = function(app, req, res) {
    const User = app.libs.db.models.User;

    let sequelizeQuery = User.sequelize;
    sequelizeQuery
        .query("SELECT name, email FROM user WHERE user_id = :userId ", {
            replacements: { userId: req.user_id },
            type: sequelizeQuery.QueryTypes.SELECT,
        }).then((result) => {
            console.log(result);
            if (result !== undefined && result.length > 0) {
                res.status(200).json({
                    status_code: 201,
                    message: "Dados do usuário",
                    is_error: false,
                    data: result,
                    params_validation: [],
                });
            }
        }).catch((error) => {
            console.log(error);

            res.status(200).json({
                status_code: 500,
                message: "Falha na operação ",
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
}

module.exports.deleteUser = function(app, req, res) {
    const User = app.libs.db.models.User;

    User.destroy({ where: { user_id: req.params.user_id } })
        .then((result) => {
            if (result != undefined && result == 0) {
                res.status(200).json({
                    status_code: 202,
                    message: "Usuário não encontrado",
                    is_error: false,
                    data: [],
                    params_validation: [],
                });
                return;
            }

            res.status(200).json({
                status_code: 201,
                message: "Usuario deletado com sucesso!",
                is_error: false,
                data: [],
                params_validation: [],
            });
        })
        .catch((error) => {
            res.status(200).json({
                status_code: 500,
                message: "Falha ao tentar deletar " + error,
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
};