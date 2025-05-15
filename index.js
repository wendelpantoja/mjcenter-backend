const express = require("express")
const cors = require("cors")
const app = express()
const AuthRouters = require("./routes/auth")
const ClientsRouters = require("./routes/clients")

const port = 8080
app.use(express.urlencoded({
    extended: true,
}))
app.use(express.json())
app.use(cors());
app.use(AuthRouters)
app.use(ClientsRouters)

app.listen(port, () => console.log("Rodando na porta: ", port));