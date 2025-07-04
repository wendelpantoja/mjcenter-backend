const instance = require("../services/api.service")

class Product {
    async getProduct(req, res) {
        const { id } = req.params

        if (!id || typeof id !== 'string' || id.trim() === '') {
            return res.status(400).json({ error: "Parâmetro 'id' inválido." });
        }

        if (!process.env.API_PRODUCTS || !process.env.API_AUTHORIZATION_CODE) {
            return res.status(500).json({ error: "Configuração da API incompleta." });
        }

        try {
            const response = await instance.get(`${process.env.API_PRODUCTS}`, {
                params: {
                    idsProdutos: id,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            });
            const data = response.data;

            if (!data || data.length === 0) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }

            const price = data.map(product => product.preco)

            res.json({price: price[0]});
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: "Erro ao buscar produto." });
        }
    }
}

module.exports = new Product();