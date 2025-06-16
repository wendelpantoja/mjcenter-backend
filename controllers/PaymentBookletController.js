const instance = require("../services/api.service");
const createPaymentBooklet = require("../utils/pdf_payment_booklet/createPaymentBooklet");

function transformValue(value) {
    const newValue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value)
    return newValue
}

function tranformData(parcelas, vendas) {
  return parcelas
  .filter(parcela => parcela.baixada === false && parcela.totalParcelas > 1)
  .map(parcela => {
    const pedidoRelacionado = vendas.find(venda => venda.numero === parcela.numeroDocumento);

    const produtos = pedidoRelacionado?.itens?.map(item => item.descricao) || [];

    return {
        vencimento: parcela.dataVencimento.replace(/-/g, '/'),
        valor: transformValue(parcela.valor),
        pedido: parcela.numeroDocumento,
        numeroParcela: parcela.numeroParcela,
        entidade: parcela.entidade.nome,
        emissao: parcela.dataEmissao.replace(/-/g, '/'),
        cliente: parcela.nomeTerceiro,
        documento: parcela.documentoTerceiro,
        valorTotalParcelas: transformValue(parcela.valorTotalParcelas),
        totalParcela: parcela.totalParcelas,
        hitoricoParcela: parcela.historico,
        produtos: produtos.join(", ")
    };
  });
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
                    entidades: entity,
                    token: process.env.API_AUTHORIZATION_CODE
                }
            });

            if (response01.data.length === 0) {
                return res.status(404).json({ message: 'Nenhuma parcela encontrada.' });
            }

            const numerosDocumento = new Set()
            const parcelas = response01.data
            parcelas.forEach(parcela => {
                if(parcela.baixada === false && parcela.totalParcelas > 1) {
                    numerosDocumento.add(parcela.numeroDocumento)
                }
            });

            const response02 = await instance.get(`${process.env.API_SALES_ORDER}?`, {
                params: {
                    numeros: [...numerosDocumento].join(','),
                    token: process.env.API_AUTHORIZATION_CODE
                }
            })

            const vendas = response02.data

            const parcelasCarne = tranformData(parcelas, vendas)

            const pdfBuffer = await createPaymentBooklet(parcelasCarne);

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
