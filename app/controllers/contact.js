module.exports.deleteContactIds = function(app, req, res) {

    const Contact = app.libs.db.models.Contact;

    if (req.body != undefined) {
        res.status(200).send({
            status_code: 203,
            message: "Corpo da requisição está vazio!",
            is_error: false,
            data: [],
            params_validation: [],
        });
        return;
    }

    let sequelizeQuery = Contact.sequelize;
    sequelizeQuery.query("DELETE FROM contact WHERE user_id = :userId AND contact_id IN(:contactId)", {
        replacements: { 
            userId: req.user_id, 
            contactId: req.body 
        },
        dialectOptions: {
            multipleStatements: true
        },
        type: sequelizeQuery.QueryTypes.DELETE,
    }).then((result) => {
        res.status(200).send({
            status_code: 201,
            message: "Contatos deletado com sucesso!",
            is_error: false,
            data: [result],
            params_validation: [],
        });
    })
    .catch((error) => {
        console.log(error);

        res.status(200).send({
            status_code: 500,
            message: "Falha ao tentar buscar",
            is_error: true,
            data: [],
            params_validation: [],
        });
    });

}

module.exports.searchWithPage = function(app, req, res) {

    const Contact = app.libs.db.models.Contact;

    console.log(req.query);

    if (req.query.page == null ||
        req.query.page == undefined || 
        req.query.page.trim() === '') {
       res.status(200).send({
           status_code: 204,
           message: "A query está vazia!",
           is_error: false,
           data: [],
           params_validation: [],
       });
       return;
   }

    const page = +req.query.page || 1;

    const limit = +req.query.limit || 10;

    const salt = (page-1) * limit;

    let sequelizeQuery = Contact.sequelize;
    sequelizeQuery.query("SELECT * FROM contact WHERE user_id = :query LIMIT :limit OFFSET :offset", {
        replacements: { 
            query: req.user_id, 
            limit: limit, 
            offset: salt 
        },
        type: sequelizeQuery.QueryTypes.SELECT,
    })
    .then((result) => {
       
        console.log(result);
            
        if (result.length <= 0) {
            res.status(200).send({
                status_code: 204,
                message: "Busca não econtrada!",
                is_error: false,
                data: [],
                params_validation: [],
            });
            return;
        }

        const qtdeQuery = Array();
        qtdeQuery[0] = result;
        for (var i = 0; i < result.length; i++) {
            result[i].image =
                "http://tmsolucaotecnologia.dev.br/image/profile_placeholder.png";
        }
        if (qtdeQuery[0].length > 0) {
            res.status(200).send({
                status_code: 201,
                message: "Contatos obtido com sucesso",
                is_error: false,
                data: result,
                params_validation: [],
            });
        } else {
            res.status(200).send({
                status_code: 204,
                message: "Busca não econtrada!",
                is_error: false,
                data: [],
                params_validation: [],
            });
        }

    }).catch((error) => {
        console.log(error);

        res.status(200).send({
            status_code: 500,
            message: "Falha ao tentar buscar",
            is_error: true,
            data: [],
            params_validation: [],
        });
    });
}

module.exports.search = function(app, req, res) {
    const Contact = app.libs.db.models.Contact;
    
    console.log(req.query);

    if (req.query.query == null ||
         req.query.query == undefined || 
         req.query.query.trim() === '') {
        res.status(200).send({
            status_code: 204,
            message: "A query está vazia!",
            is_error: false,
            data: [],
            params_validation: [],
        });
        return;
    }

    let sequelizeQuery = Contact.sequelize;
    sequelizeQuery
        .query("SELECT * FROM contact WHERE user_id = :userId and name LIKE :contactName ", {
            replacements: { 
                userId: req.user_id ,
                contactName: `%${req.query.query}%`
            },
            type: sequelizeQuery.QueryTypes.SELECT,
        }).then((result) => {
            console.log(result);
            
            if (result.length <= 0) {
                res.status(200).send({
                    status_code: 204,
                    message: "Busca não econtrada!",
                    is_error: false,
                    data: [],
                    params_validation: [],
                });
                return;
            }

            const qtdeQuery = Array();
            qtdeQuery[0] = result;
            for (var i = 0; i < result.length; i++) {
                result[i].image =
                    "http://tmsolucaotecnologia.dev.br/image/profile_placeholder.png";
            }
            if (qtdeQuery[0].length > 0) {
                res.status(200).send({
                    status_code: 201,
                    message: "Contatos obtido com sucesso",
                    is_error: false,
                    data: result,
                    params_validation: [],
                });
            } else {
                res.status(200).send({
                    status_code: 204,
                    message: "Busca não econtrada!",
                    is_error: false,
                    data: [],
                    params_validation: [],
                });
            }
        })
        .catch((error) => {
            console.log(error);

            res.status(200).send({
                status_code: 500,
                message: "Falha ao tentar buscar",
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
}

module.exports.create = function(app, req, res) {
    const Contact = app.libs.db.models.Contact;

    req.assert("name", "Nome é obrigatório").notEmpty();
    req.assert("phone", "Telefone é obrigatório").notEmpty();

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

    let updateValues = {};
    updateValues.user_id = req.user_id;

    if (req.body.name !== undefined) {
        updateValues.name = req.body.name;
    }

    if (req.body.email !== undefined || req.body.email != null) {
        updateValues.email = req.body.email;
    }

    if (req.body.address !== undefined || req.body.address != null) {
        updateValues.address = req.body.address;
    }

    if (req.body.phone !== undefined) {
        updateValues.phone = req.body.phone;
    }
    
    console.log(updateValues);

    Contact.create(updateValues)
        .then((result) => {
            res.status(200).send({
                status_code: 201,
                message: "Contato salvo com sucesso!",
                is_error: false,
                data: [{ contact_id: result.contact_id }],
                params_validation: errors,
            });
        })
        .catch((e) => {

            console.log(e);

            let error = [];
            let statusCode = 500;
            let msgError = "Falha ao tentar salvar";
            if (error != undefined) {
                error = e.errors;
            }
            if (error != undefined && error.length > 0) {
                statusCode = 202;
                msgError = error[0].message;
            }

            res.status(200).send({
                status_code: statusCode,
                message: msgError,
                is_error: true,
                data: [],
                params_validation: errors,
            });
        });
};

module.exports.getById = function(app, req, res) {
    const Contact = app.libs.db.models.Contact;

    if (req.params.contact_id == undefined) {
        res.status(200).send({
            status_code: 203,
            message: "Campo não foi preenchido",
            is_error: true,
            data: [],
            params_validation: [{
                msg: "Parâmetro é obrigatório",
                param: "contact_id",
            }, ],
        });
        return;
    }

    let sequelizeQuery = Contact.sequelize;
    sequelizeQuery
        .query("SELECT * FROM contact WHERE contact_id = :query ", {
            replacements: { query: req.params.contact_id },
            type: sequelizeQuery.QueryTypes.SELECT,
        })
        .then((result) => {
            const qtdeQuery = Array();
            qtdeQuery[0] = result;
            for (var i = 0; i < result.length; i++) {
                result[i].image =
                    "http://tmsolucaotecnologia.dev.br/image/profile_placeholder.png";
            }
            if (qtdeQuery[0].length > 0) {
                res.status(200).send({
                    status_code: 201,
                    message: "Contato obtido com sucesso!",
                    is_error: false,
                    data: result,
                    params_validation: [],
                });
            } else {
                res.status(200).send({
                    status_code: 204,
                    message: "Contato não foi encontrado!",
                    is_error: false,
                    data: [],
                    params_validation: [],
                });
            }
        })
        .catch((e) => {
            res.status(200).send({
                status_code: 500,
                message: "Falha ao tentar buscar",
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
};

module.exports.contactsMock = function(app, req, res) {
    const result = [];
    for (var i = 0; i < 30; i++) {
        let contackMockId = i + 1;
        result.push({
            contact_id: contackMockId,
            name: "Meu contato " + contackMockId,
            email: "meu@email.com " + contackMockId,
            address: "meu endereço " + contackMockId,
            phone: "12345676" + contackMockId,
            image: "http://tmsolucaotecnologia.dev.br/image/profile_placeholder.png",
            createdAt: "2021-10-27T18:03:14.000Z",
            updatedAt: "2021-10-27T18:03:14.000Z",
            user_id: 1,
        });
    }
    res.status(200).send({
        status_code: 201,
        message: "Contatos obtidos com sucesso",
        is_error: false,
        data: result,
        params_validation: [],
    });
};

module.exports.contacts = function(app, req, res) {
    const Contact = app.libs.db.models.Contact;

    let sequelizeQuery = Contact.sequelize;
    sequelizeQuery
        .query("SELECT * FROM contact WHERE user_id = :query ", {
            replacements: { query: req.user_id },
            type: sequelizeQuery.QueryTypes.SELECT,
        })
        .then((result) => {
            const qtdeQuery = Array();
            qtdeQuery[0] = result;
            for (var i = 0; i < result.length; i++) {
                result[i].image =
                    "http://tmsolucaotecnologia.dev.br/image/profile_placeholder.png";
            }
            if (qtdeQuery[0].length > 0) {
                res.status(200).send({
                    status_code: 201,
                    message: "Contatos obtido com sucesso",
                    is_error: false,
                    data: result,
                    params_validation: [],
                });
            } else {
                res.status(200).send({
                    status_code: 204,
                    message: "Nenhum contato cadastrado!",
                    is_error: false,
                    data: [],
                    params_validation: [],
                });
            }
        })
        .catch((e) => {
            res.status(200).send({
                status_code: 500,
                message: "Falha ao tentar buscar",
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
};

module.exports.delete = function(app, req, res) {
    const Contact = app.libs.db.models.Contact;


    let sequelizeQuery = Contact.sequelize;
    sequelizeQuery.query("DELETE FROM contact WHERE user_id = :userId AND contact_id = :contactId", {
        replacements: { 
            userId: req.user_id, 
            contactId: req.params.contact_id
        },
        type: sequelizeQuery.QueryTypes.DELETE,
    }).then((result) => {
        if (result != undefined && result == 0) {
            res.status(200).json({
                status_code: 202,
                message: "Contato não encontrado",
                is_error: false,
                data: [],
                params_validation: [],
            });
            return;
        }

        res.status(200).json({
            status_code: 201,
            message: "Contato deletado com sucesso!",
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

module.exports.update = function(app, req, res) {
    const Contact = app.libs.db.models.Contact;

    req.assert("name", "Nome é obrigatório").notEmpty();
    req.assert("phone", "Telefone é obrigatório").notEmpty();

    var erros = req.validationErrors();
    var errors = [];

    if (erros.length === 4) {
        for (var i = 0; i < erros.length; i++) {
            errors.push({ param: erros[i].param, msg: erros[i].msg });
        }

        res.status(200).send({
            status_code: 203,
            message: "Preencha pelo menos um campo para atualizar",
            is_error: true,
            data: [],
            params_validation: errors,
        });
        return;
    }
    if (req.params.contact_id == undefined) {
        res.status(200).send({
            status_code: 203,
            message: "Parâmetro não está preenchido!",
            is_error: true,
            data: [],
            params_validation: [{
                msg: "Id do contato é obrigatório",
                param: "contact_id",
            }, ],
        });
        return;
    }
    let updateValues = {};
    if (req.body.name !== undefined) {
        updateValues.name = req.body.name;
    }

    if (req.body.email !== undefined) {
        updateValues.email = req.body.email;
    }

    if (req.body.address !== undefined) {
        updateValues.address = req.body.address;
    }

    if (req.body.phone !== undefined) {
        updateValues.phone = req.body.phone;
    }

    console.log(updateValues);

    Contact.update(updateValues, { where: { contact_id: req.params.contact_id } })
        .then((result) => {
            console.log("resultado " + result);
            if (result > 0) {
                res.status(200).json({
                    status_code: 201,
                    message: "Contato atualizado com sucesso!",
                    is_error: false,
                    data: [],
                    params_validation: [],
                });
            } else {
                res.status(200).json({
                    status_code: 202,
                    message: "Contato não encontrado",
                    is_error: true,
                    data: [],
                    params_validation: [],
                });
            }
        })
        .catch((error) => {
            res.status(200).json({
                status_code: 500,
                message: "Falha ao tentar atualizar " + error,
                is_error: true,
                data: [],
                params_validation: [],
            });
        });
};