class Clients {
    getClients(req, res) {
        res.send("Consultar clientes")
    }
}

module.exports = new Clients()