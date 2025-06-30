const instance = require("../services/api.service");

class Stock {
    async getStock(req, res) {
        const { inicio = 0, quantidade = 10, alteradoApos = "25/06/2025 00:00:00" } = req.query;

        if (!process.env.API_STOCK || !process.env.API_AUTHORIZATION_CODE) {
            return res.status(500).json({ error: "Configuração da API incompleta." });
        }

        if (isNaN(inicio) || isNaN(quantidade)) {
            return res.status(400).json({ error: "'inicio' e 'quantidade' devem ser números." });
        }

        const isValidDate = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(alteradoApos);
        if (!isValidDate) {
            return res.status(400).json({ error: "Formato de data inválido para 'alteradoApos'. Use dd/mm/yyyy HH:MM:ss" });
        }

        try {
            const response = await instance.get(`${process.env.API_STOCK}`, {
                params: {
                    inicio,
                    quantidade,
                    entidades: "1",
                    alteradoApos,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            });
            const data = response.data
            res.json(data);
        } catch (error) {
            console.error("Erro de estoque: ", error.message);
            res.status(500).json({ error: "Erro ao buscar estoque." });
        }
    }
}

module.exports = new Stock();