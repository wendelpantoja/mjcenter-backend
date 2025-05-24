const instance = require("../services/api.service")

class Clients {
    async getClients(req, res) {
        try {
            const {nome, doc} = req.body

            if(nome === "" && doc === "") {
                return res.json({messages: {
                    alert: "Nenhum dado disponível",
                    message: "Preencha os campos acima para realizar a busca por um cliente."
                }})
            }

            const nameUrl = nome.replace(/\s+/g, "%20")
            const cpf = doc.replace(/[.-]/g, '')

            const response = await instance.get(`/apps/api/terceiros/?inicio=0&quantidade=10&tipopessoa=pf&nome=${nameUrl}&documento=${cpf}&token=${process.env.API_AUTHORIZATION_CODE}`)
            
            if(Array.isArray(response.data) && response.data.length === 0) {
                return res.json({messages: {
                    alert: "Cliente não encontrado",
                    message: "Por favor, verifique se os critérios de busca foram preenchidos corretamente."
                }})
            }
            
            const clients = response.data.map((client) => {
                return {
                    name: client.nome,
                    document: client.documento == "" ? "Sem documento" : client.documento,
                    limitCredit: client.limiteCredito === undefined ? "Sem Crédito" : new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    }).format(client.limiteCredito?.valorTotal),
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