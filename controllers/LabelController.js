const instance = require("../services/api.service");
const EtiquetaProdutos = require("../models/label");

class Etiqueta {
    async getProductToLabel(req, res) {
        const products = req.body.dataLabel.systemCode;
        const isDefaultLabel = req.body.dataLabel.isDefaultLabel;
        
        if(products.length > 10) {
            return res.status(400).json({ message: "O sistema gera apenas 10 etiquetas" })
        }

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Preencha o campo ou verifique se está correto" });
        }

        try {
            const promises = products.map(async (codigo) => {
                const { data } = await instance.get(`${process.env.API_PRODUCTS}?`, {
                    params: {
                        codigoSistema: codigo,
                        token: process.env.API_AUTHORIZATION_CODE
                    }
                });

                if (!data || data.length === 0) {
                    throw new Error(`Produto com código ${codigo} não encontrado`);
                }

                return {
                    id: data[0].id,
                    descricao: data[0].descricao,
                    unidade: data[0].unidade,
                    preco: data[0].preco,
                    codigoBarras: data[0].codigoSistema,
                };
            });

            const response = await Promise.all(promises);

            if (response.length === 0) {
                return res.status(404).json({ message: "Nenhum produto válido foi retornado." });
            }

            const pdfBuffer = await EtiquetaProdutos.gerarPDFEtiqueta(response, isDefaultLabel);

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="etiquetas.pdf"',
            });

            return res.send(pdfBuffer);

        } catch (error) {
            console.error("Erro ao gerar etiquetas:", error.message);
            return res.status(500).json({ message: "Erro na geração do PDF", detalhe: error.message });
        }
    }
}

module.exports = new Etiqueta();