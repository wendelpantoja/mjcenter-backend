const path = require('path');
const PdfPrinter = require('pdfmake');
const createTablePaymentBooklet = require('./createTablePaymentBooklet');

const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../../fonts', 'Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../../fonts', 'Roboto-Bold.ttf'),
        italics: path.join(__dirname, '../../fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../../fonts', 'Roboto-BoldItalic.ttf')
    }
};

function createPaymentBooklet(data) {
    return new Promise((resolve, reject) => {
        const printer = new PdfPrinter(fonts);
        const content = createTablePaymentBooklet(data);

        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [17.5, 5, 1, 1],
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

        const chunks = [];
        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', err => reject(err));

        pdfDoc.end();
    });
}

module.exports = createPaymentBooklet;