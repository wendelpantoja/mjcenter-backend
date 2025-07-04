const instance = require("../services/api.service");

class Stock {
    async getStock(req, res) {
        const { internalCodes, entitys, changedAfter } = req.body;

        if (!process.env.API_STOCK || !process.env.API_AUTHORIZATION_CODE) {
            return res.status(500).json({ error: "Configuração da API incompleta." });
        }

        if (!entitys?.length || !changedAfter) {
            return res.status(400).json({ error: "Informe as entidades e a data!" });
        }

        // Aceita apenas formato dd-mm-yyyy HH:MM:ss (com hífens)
        const isValidDate = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(changedAfter);

        if (!isValidDate) {
            return res.status(400).json({ error: "Formato de data inválido. Use dd-mm-yyyy HH:MM:ss" });
        }

        try {
            const response = await instance.get(process.env.API_STOCK, {
                params: {
                    codigosInternos: internalCodes,
                    entidades: entitys,
                    alteradoApos: changedAfter,
                    inicio: 0,
                    quantidade: 100,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            });

            const data = response.data;

            if (!data || (Array.isArray(data) && data.length === 0)) {
                return res.status(404).json({ error: "Nenhum item de estoque encontrado." });
            }

            res.json(data);
        } catch (error) {
            console.error("Erro ao buscar estoque:", error.message);
            res.status(500).json({ error: "Erro interno ao buscar estoque." });
        }
    }
}

module.exports = new Stock();