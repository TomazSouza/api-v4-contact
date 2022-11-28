module.exports.pushNotification = function(app, req, res) {
    req
        .assert("token_notification", "Token notification é obrigatório")
        .notEmpty();

    req.assert("message", "Mensagem é obrigatória").notEmpty();

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

    const notificaitonOptions = {
        priority: "high",
        timeToLive: 60 * 60 * 24,
    };

    const registrationToken = req.body.token_notification;
    const message = req.body.message;
    const channelId = req.body.channel_id;
    const options = notificaitonOptions;

    console.log(req.body);

    const payload = {
        data: {
            channel_id: channelId,
            message: message,
        },
    };

    const admin = app.libs.firebaseConfig.admin;

    admin
        .messaging()
        .sendToDevice(registrationToken, payload, options)
        .then((response) => {
            console.log(response);
            if (response.successCount == 0) {
                console.log(response.results[0].error.errorInfo);
                res.status(200).send({
                    status_code: 209,
                    message: "Falha ao tentar enviar ",
                    is_error: true,
                    data: [],
                    params_validation: [
                        {
                            param: response.results[0].error.errorInfo.code,
                            msg: response.results[0].error.errorInfo.message
                        }
                    ],
                });
                return;
            }
            res.status(200).send({
                status_code: 201,
                message: "Notificação enviada com sucesso!",
                is_error: false,
                data: [],
                params_validation: [],
            });
        })
        .catch((error) => {
            res.status(200).send({
                status_code: 500,
                message: "Falha ao tentar enviar " + error,
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
};