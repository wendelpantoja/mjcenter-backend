const instance = require("../services/api.service");

class Balance {
    static async getBalance(req, res) {
        try {
            const document = req.params.document;
        
            const response = await instance.get(
                `${process.env.API_BALANCE_CLIENT}?`,
                {
                    params: {
                        documentoTerceiro: document,
                        token: process.env.API_AUTHORIZATION_CODE
                    }
                }
            );

            const data = response.data;
            const hoje = new Date();

            const totalAberto = data
                .filter(conta => conta.baixada === false)
                .reduce((acc, conta) => acc + conta.valor, 0);

            
            const parcelasEmAtraso = data.filter(conta => {
                const [day, month, year] = conta.dataVencimento.split('-');
                const dataVencimento = new Date(`${year}-${month}-${day}`);
                return conta.baixada === false && dataVencimento < hoje;
            }).length;

            res.json([
                {
                    balance: totalAberto,
                    overdueInstallments: parcelasEmAtraso
                }
            ]);

        } catch (error) {
            console.error('Erro ao consultar saldo:', error.message);
            res.status(500).json({ error: 'Erro ao consultar saldo do cliente.' });
        }
    }
}

module.exports = Balance;