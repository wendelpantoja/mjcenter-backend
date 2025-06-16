const instance = require("../services/api.service")
class EntityController {
    async getEntity(req, res) {
        const response = await instance.get(`${process.env.API_ENTITY}?`, {
            params: {
                status: "ATIVO",
                token: process.env.API_AUTHORIZATION_CODE
            }
        })
        const entitys = response.data 
        const entityReduced = entitys.map((entity) => {
            return {
                nome: entity.nome,
                idEmpresa: entity.idEmpresa
            }
        })
        res.json(entityReduced)
    }
}

module.exports = new EntityController()