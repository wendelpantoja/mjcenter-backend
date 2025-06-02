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

            const cpf = doc.replace(/[.-]/g, '')

            const response = await instance.get(`${process.env.API_CLIENTS}?`, {
                params: {
                    tipoPessoa: "PF",
                    nome: nome.toUpperCase(),
                    documento: cpf,
                    inicio: 0,
                    quantidade: 15,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            })
            
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
                    limitCredit: client.limiteCredito === undefined ? undefined : client.limiteCredito?.valorTotal,
                    contact: client.telefones[0] == undefined ? "Sem contato" : `(${client.telefones[0].ddd}) ${client.telefones[0].numero}`,
                }
            })

            res.json(clients)
        } catch (error) {
            console.error("Erro no getClients:", error);
            return res.status(500).json({
                alert: "Erro interno do servidor.",
                message: "Por favor, tente novamente mais tarde ou atualize a página.",
                error: "Erro interno do servidor. Por favor, tente novamente mais tarde.",
            });
        }
    }
}

module.exports = new Clients()