const instance = require("../services/api.service")

class Product {
    async getStock(req, res) {
        const { systemCode, description } = req.body

        if(!systemCode && !description) {
            return res.status(400).json({ 
                severity: "warning",
                message: "Aviso",
                details: "Preencha o código ou descrição para verificar estoque"
            })
        }

        if (!process.env.API_PRODUCTS || !process.env.API_AUTHORIZATION_CODE) {
            return res.status(500).json({
                severity: "error",
                message: "Error", 
                details: "Configuração da API incompleta." 
            });
        }

        try {
            const response = await instance.get(`${process.env.API_PRODUCTS}`, {
                params: {
                    codigoSistema: systemCode,
                    descricao: description,
                    inicio: 0,
                    quantidade: 150,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            });
            const data = response.data;

            if (!data || data.length === 0) {
                return res.status(404).json({
                    severity: "warning",
                    message: "Aviso", 
                    details: "Nenhum produto foi encontrado." 
                });
            }

            const products = data.map((product) => {

                return {
                    id: product.id,
                    systemCode: product.codigoSistema,
                    description: product.descricao,
                    price: product.preco
                }
            })

            const idsProducts = products.map(product => product.id)

            const response02 = await instance.get(`${process.env.API_STOCK}`, {
                params: {
                    produtos: idsProducts.join(","),
                    token: process.env.API_AUTHORIZATION_CODE
                }
            })
            const stock = response02.data

            const productsById = new Map(products.map(p => [p.id, p]));

            const expandedProducts = stock
            .filter(item => 
                productsById.has(item.idProduto) && item.quantidade > 0
            )
            .map(item => {
                const baseProduct = productsById.get(item.idProduto);
                return {
                ...baseProduct,
                stockLocation: item.entidade?.nome || "Local desconhecido",
                stockQuantity: item.quantidade
                };
            });

            if(!expandedProducts || expandedProducts.length === 0) {
                return res.status(404).json({
                    severity: "warning",
                    message: "Aviso",  
                    details: "Não foi encontrado estoque para o produto"
                })
            }

            res.json(expandedProducts);
        } catch (error) {
            res.status(500).json({
                severity: "error",
                message: "Error", 
                details: "Erro ao buscar produto." 
            });
        }
    }
}

module.exports = new Product();