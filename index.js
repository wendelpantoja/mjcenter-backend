require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const ClientsRouters = require('./routes/clients');
const StockRouters = require('./routes/stock');
const EntityRouters = require("./routes/entity")
const LabelRouters = require("./routes/label")

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Rotas
app.use(ClientsRouters);
app.use(EntityRouters);
app.use(StockRouters);
app.use(LabelRouters);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
