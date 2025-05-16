const instance = require("../services/api.service")
require("dotenv").config()

class Clients {
    async getClients(req, res) {
        try {
            const nameUrl = req.body.nome.replace(/\s+/g, "%20")

            const data = await instance.get(`/apps/api/terceiros/?inicio=0&quantidade=10&nome=${nameUrl}&token=${process.env.API_AUTHORIZATION_CODE}`)
            const clients = data.data
            .filter((type) => type.tipoPessoa == "PF")
            .map((client) => {
                return {
                    name: client.nome,
                    document: client.documento == "" ? "Sem documento" : client.documento,
                    limitCredit: client.limiteCredito == undefined ? "Sem crédito" : client.limiteCredito.valorTotal.toString(),
                    balance: "",
                    contact: client.telefones[0] == undefined ? "Sem contato" : `(${client.telefones[0].ddd}) ${client.telefones[0].numero}`,
                }
            })
            res.json(clients)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new Clients()