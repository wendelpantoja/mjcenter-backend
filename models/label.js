const PDFDocument = require("pdfkit");
const bwipjs = require("bwip-js");
const fs = require("fs");

// === CONFIGURAÇÃO ===
const ETIQUETA_LARGURA = 295;
const ETIQUETA_ALTURA = 150;
const ETIQUETA_LARGURA_SMALL = 145;

const PADDING_HORIZONTAL_DEFAULT = 2;
const PADDING_HORIZONTAL_SMALL = 10;
const PADDING_VERTICAL = 10;

const A4_LARGURA = 595;
const A4_ALTURA = 842;

class Etiqueta {
    static gerarSimulacoes(valorAVista) {
        const opcoes = [
            { porcentagem: 0.22, totalParcelas: 6, jurosMensal: 3.66 },
            { porcentagem: 0.27, totalParcelas: 8, jurosMensal: 3.37 },
            { porcentagem: 0.33, totalParcelas: 10, jurosMensal: 3.33 }
        ];

        return opcoes.map(({ porcentagem, totalParcelas, jurosMensal }) => {
            const parcela = valorAVista * porcentagem;
            const totalAPrazo = (parcela + valorAVista);
            const parcelaFinal = totalAPrazo / totalParcelas;

            const format = (value) => new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(value);

            return {
                entrada: [totalParcelas - 1, format(parcelaFinal)],
                total: format(totalAPrazo),
                juros: jurosMensal.toFixed(2)
            };
        });
    }

    static async gerenteSmall(doc, produto, x, y) {
        doc.lineWidth(0.5);
        doc.strokeColor("#000000");
        doc.rect(x, y, ETIQUETA_LARGURA_SMALL, ETIQUETA_ALTURA).stroke();

        const margemInterna = 8;

        if (fs.existsSync("logo.png")) {
            doc.image("logo.png", x + margemInterna, y + 0, { width: 30 });
        }

        doc.font("Helvetica")
            .fontSize(8)
            .text(produto.descricao, x + margemInterna, y + 28, {
                width: ETIQUETA_LARGURA_SMALL * 0.90,
                height: 30,
                ellipsis: true,
            });

        doc.font("Helvetica")
            .fontSize(8)
            .text(`UN:${produto.unidade}`, x + margemInterna, y + 60);

        doc.font("Helvetica-Bold")
            .fontSize(8)
            .text(`AVISTA`, x + margemInterna, y + 71);

        const precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(produto.preco);

        doc.font("Helvetica-Bold")
            .fontSize(16)
            .text(precoFormatado, x + margemInterna, y + 81);

        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: "code39",
            text: produto.codigoBarras,
            scaleX: 2.4,
            scaleY: 1.2,
            height: 10,
            includetext: false,
        });

        doc.image(barcodeBuffer, x + margemInterna, y + 100, { width: 110, height: 18 });

        doc.font("Helvetica")
            .fontSize(10)
            .text(produto.codigoBarras, x + margemInterna, y + 121);

        doc.font("Helvetica")
            .fontSize(8)
            .text("www.mjcenter.com.br", x + margemInterna, y + 135, {
                width: ETIQUETA_LARGURA * 0.50,
                height: 30,
                ellipsis: true,
            });
    }

    static async gerenteDefault(doc, produto, x, y) {
        doc.lineWidth(0.5);
        doc.strokeColor("#000000");
        doc.rect(x, y, ETIQUETA_LARGURA, ETIQUETA_ALTURA).stroke();

        const margemInterna = 8;
        const divisor = x + (ETIQUETA_LARGURA * 0.7);

        if (fs.existsSync("logo.png")) {
            doc.image("logo.png", x + margemInterna, y + 0, { width: 30 });
        }

        doc.font("Helvetica")
            .fontSize(8)
            .text(produto.descricao, x + margemInterna, y + 28, {
                width: ETIQUETA_LARGURA * 0.50,
                height: 30,
                ellipsis: true,
            });

        doc.font("Helvetica")
            .fontSize(8)
            .text(`UN:${produto.unidade}`, x + margemInterna, y + 60);

        doc.font("Helvetica-Bold")
            .fontSize(8)
            .text(`AVISTA`, x + margemInterna, y + 71);

        const precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(produto.preco);

        doc.font("Helvetica-Bold")
            .fontSize(16)
            .text(precoFormatado, x + margemInterna, y + 81);

        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: "code39",
            text: produto.codigoBarras,
            scaleX: 2.4,
            scaleY: 1.2,
            height: 10,
            includetext: false,
        });

        doc.image(barcodeBuffer, x + margemInterna, y + 100, { width: 150, height: 18 });

        doc.font("Helvetica")
            .fontSize(10)
            .text(produto.codigoBarras, x + margemInterna, y + 121);

        const ladoDireitoX = divisor;

        doc.font("Helvetica-Bold")
            .fontSize(9)
            .text(`A PRAZO`, ladoDireitoX - 40, y + 10, {
                width: ETIQUETA_LARGURA * 0.3,
            });

        const simulacao = this.gerarSimulacoes(produto.preco);

        simulacao.forEach((item, index) => {
            const offsetY = 22 + index * 33;

            doc.font("Helvetica").fontSize(9).text(`ENTRADA + ${item.entrada[0]} = ${item.entrada[1]}`, ladoDireitoX - 40, y + offsetY);
            doc.font("Helvetica").fontSize(7).text(`TOTAL A PRAZO = ${item.total}`, ladoDireitoX - 40, y + offsetY + 10);
            doc.font("Helvetica").fontSize(7).text(`JUROS AO MÊS = ${item.juros}%`, ladoDireitoX - 40, y + offsetY + 17.5);
        });

        doc.font("Helvetica")
            .fontSize(8)
            .text("www.mjcenter.com.br", x + margemInterna, y + 135, {
                width: ETIQUETA_LARGURA * 0.50,
                height: 30,
                ellipsis: true,
            });
    }

    static async gerarPDFEtiqueta(produtos, isDefaultValue) {
        return new Promise(async (resolve, reject) => {
            try {
                const doc = new PDFDocument({ size: "A4", margin: 0 });
                const buffers = [];

                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => {
                    const pdfData = Buffer.concat(buffers);
                    console.log("PDF gerado na memória com sucesso!");
                    resolve(pdfData);
                });

                let x = isDefaultValue ? PADDING_HORIZONTAL_DEFAULT : PADDING_HORIZONTAL_SMALL;
                let y = PADDING_VERTICAL;

                for (let i = 0; i < produtos.length; i++) {
                    const produto = produtos[i];

                    const largura = isDefaultValue ? ETIQUETA_LARGURA : ETIQUETA_LARGURA_SMALL;
                    const paddingH = isDefaultValue ? PADDING_HORIZONTAL_DEFAULT : PADDING_HORIZONTAL_SMALL;

                    if (x + largura > A4_LARGURA) {
                        x = paddingH;
                        y += ETIQUETA_ALTURA + PADDING_VERTICAL;
                    }

                    if (y + ETIQUETA_ALTURA > A4_ALTURA) {
                        doc.addPage();
                        x = paddingH;
                        y = PADDING_VERTICAL;
                    }

                    if (isDefaultValue === true) {
                        await this.gerenteDefault(doc, produto, x, y);
                    } else {
                        await this.gerenteSmall(doc, produto, x, y);
                    }

                    x += largura + paddingH;
                }

                doc.end();
            } catch (error) {
                console.error("Erro ao gerar PDF:", error);
                reject(error);
            }
        });
    }
}

module.exports = Etiqueta;
