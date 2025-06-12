const instance = require("../services/api.service");
const createPaymentBooklet = require("../utils/pdf_payment_booklet/createPaymentBooklet");

function transformValue(value) {
    const newValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
    return newValue
}

class PaymentBooklet {
    async getClient(req, res) {
        const { document, startDate, endDate, dataFilter, entity } = req.body;

        if (!startDate) {
            return res.status(400).json({ message: "Os campo data precisam ser preenchidos corretamente" });
        }

        if (!entity) {
            return res.status(400).json({ message: "O campo (entidade) precisa ser preenchido" });
        }

        try {
            const response01 = await instance.get(`${process.env.API_BALANCE_CLIENT}?`, {
                params: {
                    documentoTerceiro: document,
                    desde: startDate,
                    ate: endDate,
                    filtroData: dataFilter,
                    entidade: entity,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            });

            if (response01.data.length === 0) {
                return res.status(404).json({ message: 'Nenhuma parcela encontrada.' });
            }

            const response02 = await instance.get(`${process.env.API_SALES_ORDER}?`, {
                params: {
                    numeros: response01.data[0].numeroDocumento,
                    desde: startDate,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            })

            const data01 = response01.data;
            const data02 = response02.data;
            const produtos = data02.map((data, index) => data.itens)
            const nomeProdutos = produtos[0].map((data) => data.produto.descricao)
            const totalAberto = data01
                .filter(conta => !conta.baixada)
                .map(dataParcela => ({
                    vencimento: dataParcela.dataVencimento.replace(/-/g, '/'),
                    valor: transformValue(dataParcela.valor),
                    pedido: dataParcela.numeroDocumento,
                    numeroParcela: dataParcela.numeroParcela,
                    entidade: dataParcela.entidade.nome,
                    emissao: dataParcela.dataEmissao.replace(/-/g, '/'),
                    cliente: dataParcela.nomeTerceiro,
                    documento: dataParcela.documentoTerceiro,
                    valorTotalParcelas: transformValue(dataParcela.valorTotalParcelas),
                    totalParcela: dataParcela.totalParcelas,
                    hitoricoParcela: dataParcela.historico,
                    produtos: nomeProdutos.join(', ')
                }));

            const pdfBuffer = await createPaymentBooklet(totalAberto);

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="carne.pdf"'
            });

            return res.send(pdfBuffer);
        } catch (error) {
            console.error("Erro ao gerar carnê:", error.message);
            return res.status(500).json({ message: "Erro na geração do PDF", detalhe: error.message });
        }
    }
}

module.exports = new PaymentBooklet();
