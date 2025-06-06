class PaymentBooklet {
    getClient(req, res) {
        res.send("Olá mundo, voçê está na geração de carnê")
    }
}

module.exports = new PaymentBooklet()