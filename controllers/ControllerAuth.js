class Auth {
    login(req, res) {
       res.send("Olá mundo") 
    }
}

module.exports = new Auth()