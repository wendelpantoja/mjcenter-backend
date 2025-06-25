require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const ClientsRouters = require('./routes/clients');
const ProductsRouters = require('./routes/products');
const EntityRouters = require("./routes/entity")

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Rotas
app.use(ClientsRouters);
app.use(ProductsRouters);
app.use(EntityRouters);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
