const fs = require('fs');
const path = require('path');
const PdfPrinter = require('pdfmake');

class PaymentBooklet {
    getClient(req, res) {
        const A4_WIDTH = 595;
        const A4_HEIGHT = 842;

        const fonts = {
        Roboto: {
            normal: path.join(__dirname, '../fonts', 'Roboto-Regular.ttf'),
            bold: path.join(__dirname, '../fonts', 'Roboto-Bold.ttf'),
            italics: path.join(__dirname, '../fonts', 'Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname, '../fonts', 'Roboto-BoldItalic.ttf')
        }
        };

        const printer = new PdfPrinter(fonts);

        // Carrega a logo como base64
        const logoBase64 = fs.readFileSync(path.join(__dirname, '../logo.png')).toString('base64');

        // Dados das parcelas
        const parcelas = [
            {
                cliente: 'José da Silva',
                documento: '123.456.789-00',
                referencia: 'Compra Loja 001',
                numero: 1,
                total: 3,
                vencimento: '10/06/2025',
                valor: 500.00,
                descricao: 'Pagamento de produtos diversos',
            },
            {
                cliente: 'José da Silva',
                documento: '123.456.789-00',
                referencia: 'Compra Loja 001',
                numero: 2,
                total: 3,
                vencimento: '10/07/2025',
                valor: 500.00,
                descricao: 'Pagamento de produtos diversos',
            },
            {
                cliente: 'José da Silva',
                documento: '123.456.789-00',
                referencia: 'Compra Loja 001',
                numero: 3,
                total: 3,
                vencimento: '10/08/2025',
                valor: 500.00,
                descricao: 'Pagamento de produtos diversos',
            },
            {
                cliente: 'José da Silva',
                documento: '123.456.789-00',
                referencia: 'Compra Loja 001',
                numero: 3,
                total: 3,
                vencimento: '10/08/2025',
                valor: 500.00,
                descricao: 'Pagamento de produtos diversos',
            },
            {
                cliente: 'José da Silva',
                documento: '123.456.789-00',
                referencia: 'Compra Loja 001',
                numero: 3,
                total: 3,
                vencimento: '10/08/2025',
                valor: 500.00,
                descricao: 'Pagamento de produtos diversos',
            },
        ];

        // Função para gerar carnê PDF
        function gerarCarne(parcelas) {
            const content = [];

            parcelas.forEach((parcela) => {
                content.push(
                    {
                    table: {
                        widths: ['*', 15, 15, 15, '*', '*'],
                        body: [
                            [
                                {
                                    rowSpan: 2,
                                    stack: [
                                        {
                                            image: `data:image/png;base64,${logoBase64}`,
                                            width: 60,
                                            margin: [35, 0, 0, 0]
                                        },
                                    ],
                                    border: [true, true, false, true],
                                },
                                {
                                    colSpan: 4,
                                    rowSpan: 2,
                                    text: [
                                        {
                                            border: [false, true, true, true],
                                            text: "MJ CENTER\n",
                                            bold: true,
                                            fontSize: 10,
                                        },
                                        {
                                            text: "Fone: 091 3781-3565\n",
                                            fontSize: 10,
                                        },
                                        {
                                            text: "End: Av Cônego Siqueira, 1700 - Cametá\n",
                                            fontSize: 10,
                                        },
                                        {
                                            text: "Site: www.mjcenter.com.br",
                                            fontSize: 10,
                                        }
                                    ],
                                    border: [false, true, false, false],
                                },
                                {},
                                {},
                                {},
                                {
                                    text: `Vencimento: ${parcela.vencimento}`,
                                    fillColor: '#ffffb2',
                                    fontSize: 12,
                                    bold: true,
                                },
                            ],
                            [
                                {},
                                {},
                                {},
                                {},
                                {},
                                {
                                    text: `Valor: R$ ${parcela.valor.toFixed(2)}`,
                                    fillColor: '#ffffb2',
                                    fontSize: 12,
                                    bold: true
                                }
                            ],
                            [
                                {colSpan: 2, text: `Parcela: ${parcela.numero}/${parcela.total}`},
                                {},
                                {colSpan: 3, text: `Emissão: ${(new Date()).toLocaleDateString()}`},
                                {},
                                {},
                                '(-) Desconto:'
                            ],
                            [
                                {colSpan: 2, text: `Natureza: FINAN`},
                                {},
                                {colSpan: 3, text: `Pedido: 00000`},
                                {},
                                {},
                                '(+) Acréscimo:'
                            ],
                            [
                                {
                                    text: `Cliente: ${parcela.cliente}`,
                                    colSpan: 5,
                                    rowSpan: 2,
                                },
                                {},
                                {},
                                {},
                                {},
                                {
                                    text: "(+) Multa:",
                                },
                            ],
                            [{}, {}, {}, {}, {}, ' '],
                        ]
                    },
                    layout: {
                        hLineWidth: (i, node) => 1,
                        vLineWidth: (i, node) => 1,
                        hLineColor: () => 'black',
                        vLineColor: () => 'black',
                    },
                    margin: [0, 0, 0, 5]
                    },
                );
            });

            const docDefinition = {
                pageSize: 'A4',
                pageMargins: [40, 10, 40, 10],
                content,
                styles: {
                    header: {
                        fontSize: 16,
                        bold: true,
                        alignment: 'center'
                    }
                },
                defaultStyle: {
                    font: 'Roboto'
                }
            };

            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.pipe(fs.createWriteStream('carne.pdf'));
            pdfDoc.end();
        }

        // Gera o PDF
        gerarCarne(parcelas);

        res.json({
            message: "PDF gerado com sucesso"
        })
    }
}

module.exports = new PaymentBooklet()