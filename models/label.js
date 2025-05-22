const PDFDocument = require("pdfkit");
const bwipjs = require("bwip-js");
const fs = require("fs");

const ETIQUETA_LARGURA = 295;
const ETIQUETA_ALTURA = 140;
const PADDING_HORIZONTAL = 2;
const PADDING_VERTICAL = 2;
const A4_LARGURA = 595;
const A4_ALTURA = 842;

class Etiqueta {
    static gerarSimulacoes(valorAVista) {
        const opcoes = [
            { porcentagem: 0.22, totalParcelas: 6, jurosMensal: 3.66 },   // entrada + 5
            { porcentagem: 0.27, totalParcelas: 8, jurosMensal: 3.37 },  // entrada + 7
            { porcentagem: 0.33, totalParcelas: 10, jurosMensal: 3.33 }  // entrada + 9
        ];

        const result = opcoes.map(({ porcentagem, totalParcelas, jurosMensal }) => {
            // Fórmula de parcelas fixas com juros compostos
            const parcela = (valorAVista * porcentagem);
            const teste01 = (parcela + valorAVista) / totalParcelas;
            const totalAPrazo = teste01 * totalParcelas;
            const parcelaFinal = totalAPrazo / totalParcelas;

            // Formatação dos resultados
            const parcelaFormatada = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(parcelaFinal);
            const totalFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(totalAPrazo);
            const jurosFormatado = jurosMensal.toFixed(2);
            const entradaMais = totalParcelas - 1;

            return {
                entrada: [entradaMais, parcelaFormatada],
                total: totalFormatado,
                juros: jurosFormatado
            }
        });

        return result
    }
    static async desenharEtiqueta(doc, produto, x, y, i) {
    // === Borda da etiqueta ===
        doc.lineWidth(0.5);
        doc.strokeColor("#000000");
        doc.rect(x, y, ETIQUETA_LARGURA, ETIQUETA_ALTURA).stroke();
    
        const margemInterna = 8;
        const divisor = x + (ETIQUETA_LARGURA * 0.7); 
    
        // ========================
        // LADO ESQUERDO DA ETIQUETA
        // ========================
    
        // Logo
        if (fs.existsSync("logo.png")) {
        doc.image("logo.png", x + margemInterna, y + 0, {
            width: 30,
        });
        }
    
        // 1. Nome do produto
        doc.font("Helvetica")
            .fontSize(8)
            .text(produto.descricao, x + margemInterna, y + 28, {
                width: ETIQUETA_LARGURA * 0.50,
                height: 30,
                ellipsis: true,
            });
    
        // 2. Preço
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
    
        // 3. Gerar código de barras (imagem)
        const barcodeBuffer = await bwipjs.toBuffer({
            bcid: "code39",
            text: produto.codigoBarras,
            scaleX: 2.4,   // Levemente maior horizontalmente
            scaleY: 1.2,   // Aumenta a altura visual final
            height: 10,    // Controla proporção total
            includetext: false,
        });
    
        // 4. Desenha o código de barras
        doc.image(barcodeBuffer, x + margemInterna, y + 100, { width: 150, height: 18, });
    
        // 5. número código de barras
        doc.font("Helvetica")
            .fontSize(10)
            .text(produto.codigoBarras, x + margemInterna, y + 121);
    
        // ========================
        // LADO DIREITO DA ETIQUETA
        // ========================
    
        const ladoDireitoX = divisor;
    
        doc.font("Helvetica-Bold")
            .fontSize(9)
            .text(`A PRAZO`, ladoDireitoX + -40, y + 10, {
                width: ETIQUETA_LARGURA * 0.3,
            });

        const simulacao = this.gerarSimulacoes(produto.preco)
        
        // Entrada 01
        doc.font("Helvetica").fontSize(9).text(`ENTRADA + ${simulacao[0].entrada[0]} = ${simulacao[0].entrada[1]}`, ladoDireitoX + -40, y + 22);
        doc.font("Helvetica").fontSize(7).text(`TOTAL A PRAZO = ${simulacao[0].total}`, ladoDireitoX + -40, y + 32);
        doc.font("Helvetica").fontSize(7).text(`JUROS AO MÊS = ${simulacao[0].juros}%`, ladoDireitoX + -40, y + 40.5);
    
        // Entrada 02
        doc.font("Helvetica").fontSize(9).text(`ENTRADA + ${simulacao[1].entrada[0]} = ${simulacao[1].entrada[1]}`, ladoDireitoX + -40, y + 55);
        doc.font("Helvetica").fontSize(7).text(`TOTAL A PRAZO = ${simulacao[1].total}`, ladoDireitoX + -40, y + 65);
        doc.font("Helvetica").fontSize(7).text(`JUROS AO MÊS = ${simulacao[1].juros}%`, ladoDireitoX + -40, y + 72.5);
    
        // Entrada 03
        doc.font("Helvetica").fontSize(9).text(`ENTRADA + ${simulacao[2].entrada[0]} = ${simulacao[2].entrada[1]}`, ladoDireitoX + -40, y + 85);
        doc.font("Helvetica").fontSize(7).text(`TOTAL A PRAZO = ${simulacao[2].total}`, ladoDireitoX + -40, y + 95);
        doc.font("Helvetica").fontSize(7).text(`JUROS AO MÊS = ${simulacao[2].juros}%`, ladoDireitoX + -40, y + 102.5);
    }

    static async gerarPDFEtiqueta(produtos) {
        return new Promise(async (resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 0 });
            const buffers = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => {
                const pdfData = Buffer.concat(buffers);
                console.log("PDF gerado na memória com sucesso!");
                resolve(pdfData);
            });

            let x = PADDING_HORIZONTAL;
            let y = PADDING_VERTICAL;

            for (let i = 0; i < produtos.length; i++) {
                const produto = produtos[i];

                if (x + ETIQUETA_LARGURA > A4_LARGURA) {
                    x = PADDING_HORIZONTAL;
                    y += ETIQUETA_ALTURA + PADDING_VERTICAL;
                }

                if (y + ETIQUETA_ALTURA > A4_ALTURA) {
                    doc.addPage();
                    x = PADDING_HORIZONTAL;
                    y = PADDING_VERTICAL;
                }

                await this.desenharEtiqueta(doc, produto, x, y, i);
                x += ETIQUETA_LARGURA + PADDING_HORIZONTAL;
            }

            doc.end();
        });
    }
}

module.exports = Etiqueta