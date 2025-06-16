const fs = require('fs');
const path = require('path');

function limitarTexto(texto, limite) {
    return texto.length > limite ? texto.substring(0, limite - 3) + '...' : texto;
}

function createTablePaymentBooklet(installments) {
    const logoBase64 = fs.readFileSync(path.join(__dirname, '../../logo.png')).toString('base64');
    const content = [];

    installments.forEach((parcela) => {
        content.push({
            stack: [
                {
                    unbreakable: true,
                    table: {
                        widths: [75, 35, 75, 75, 75, 75, 80],
                        body: [
                            [
                                {
                                    rowSpan: 4,
                                    alignment: 'center',
                                    stack: [
                                        {
                                            image: `data:image/png;base64,${logoBase64}`,
                                            width: 55,
                                            margin: [0, 0, 0, 0]
                                        },
                                    ],
                                    border: [true, true, false, true],
                                },
                                {
                                    colSpan: 3,
                                    rowSpan: 4,
                                    border: [false, true, false, false],
                                    margin: [0, 3.5, 0, 0],
                                    alignment: 'center',
                                    text: [
                                        { text: "MJ CENTER - Sempre Junto com você\n", bold: true, fontSize: 10 },
                                        { text: "Whatsapp: (91) 98646-4848\n", fontSize: 10 },
                                        { text: "Telefone Fixo: (91) 98587-5723\n", fontSize: 10 },
                                        { text: "www.mjcenter.com.br\n", fontSize: 10 }
                                    ],
                                    lineHeight: 1,
                                    valign: 'middle'
                                },
                                {}, {},
                                {
                                    rowSpan: 4,
                                    stack: [ 
                                        {
                                            qr: 'https://wa.me/5591986464848',
                                            fit: 45,
                                            alignment: 'center',
                                            margin: [0, 14, 0, 2]  
                                        },
                                        {
                                            text: 'Chama no zap',
                                            fontSize: 7,
                                            alignment: 'center',
                                            margin: [0, 0, 0, 0]
                                        }
                                    ],
                                    alignment: 'center',
                                    valign: 'middle',
                                    border: [false, true, true, true]
                                },
                                {
                                    colSpan: 2,
                                    text: `Vencimento: ${parcela.vencimento}`,
                                    fillColor: '#ffee58', // CINZA MAIS FORTE (25% preto)
                                    fontSize: 10,
                                    bold: true,
                                    lineHeight: 1,
                                    valign: "center",
                                    border: [true, true, true, false]
                                },
                                {}
                            ],
                            [{}, {}, {}, {}, {},
                                {
                                    colSpan: 2,
                                    text: `Pedido: ${parcela.pedido}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },{}
                            ],
                            [{}, {}, {}, {}, {},
                                {
                                    colSpan: 2,
                                    rowSpan: 1,
                                    text: `Parcela: ${parcela.numeroParcela}/${parcela.totalParcela}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {}
                            ],
                            [{}, {}, {}, {}, {},
                                {
                                    colSpan: 2,
                                    rowSpan: 2,
                                    text: `Entidade: ${limitarTexto(parcela.entidade, 48)}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },{}
                            ],
                            [
                                {
                                    colSpan: 2,
                                    text: `Pedido: ${parcela.pedido}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {},
                                {
                                    colSpan: 3,
                                    text: `Entidade: ${limitarTexto(parcela.entidade, 35)}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {}, {},
                                {},
                                {}
                            ],
                            [
                                {
                                    colSpan: 1,
                                    text: `Parcela: ${parcela.numeroParcela}/${parcela.totalParcela}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {
                                    colSpan: 2,
                                    text: `Emissão: ${parcela.emissao}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {},
                                {
                                    colSpan: 2,
                                    text: `Valor da compra: ${parcela.valorTotalParcelas}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                }, {},
                                {
                                    colSpan: 2,
                                    text: `Emissão: ${parcela.emissao}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {}
                            ],
                            [
                                {
                                    colSpan: 5,
                                    rowSpan: 1,
                                    text: `Cliente: ${limitarTexto(parcela.cliente, 52)}`,
                                    fontSize: 10,
                                    lineHeight: 1,
                                    bold: true
                                },
                                {}, {}, {}, {},
                                {
                                    colSpan: 2,
                                    rowSpan: 1,
                                    text: `CPF: ${parcela.documento}`,
                                    fontSize: 10,
                                    lineHeight: 1,
                                },
                                {}
                            ],
                            [
                                {
                                    colSpan: 5,
                                    text: `CPF: ${parcela.documento}`,
                                    fontSize: 10,
                                    lineHeight: 1
                                },
                                {}, {}, {}, {}, 
                                {
                                    colSpan: 2,
                                    rowSpan: 3,
                                    text: `Cliente: ${limitarTexto(parcela.cliente, 48)}`,
                                    fontSize: 10,
                                    lineHeight: 1,
                                    bold: true
                                }, {}
                            ],
                            [
                                {
                                    colSpan: 5,
                                    rowSpan: 2,
                                    text: [
                                        {text: "Produtos: ", fontSize: 10},
                                        {text: `${limitarTexto(parcela.produtos, 125)}`, fontSize: 9}
                                    ],
                                    lineHeight: 1
                                },
                                {}, {}, {}, {},
                                {},
                                {}
                            ],
                            [{}, {}, {}, {}, {},
                                {},
                                {}
                            ],
                            [
                                {
                                    colSpan: 5,
                                    alignment: "center",
                                    text: "Pague suas contas em dia e evite juros e multa! (Multa de 0.5% e Juros de 2% a.m.)",
                                    fontSize: 9,
                                    color: '#2e2d2d',
                                    italics: true,
                                    lineHeight: 1
                                }, {}, {}, {}, {},
                                {
                                    colSpan: 2,
                                    text: `Valor: ${parcela.valor}`,
                                    fontSize: 10,
                                    bold: true,
                                    lineHeight: 1,
                                }, 
                                {}
                            ],
                        ]
                    },
                    layout: {
                        hLineWidth: () => 0.5,
                        vLineWidth: () => 0.5,
                        hLineColor: () => '#999999', // CINZA MAIS VISÍVEL (60% preto)
                        vLineColor: () => '#999999',
                        paddingTop: () => 1,
                        paddingBottom: () => 1,
                        paddingLeft: () => 2,
                        paddingRight: () => 2
                    },
                    margin: [17, 0, 0, 15]
                }
            ]
        });
    });

    return content;
}

module.exports = createTablePaymentBooklet;