require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const AuthRouters = require('./routes/auth');
const ClientsRouters = require('./routes/clients');
const ProductsRouters = require('./routes/products');
const UserRouters = require('./routes/user')

const sequelize = require('./config/database');

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Rotas
app.use(AuthRouters);
app.use(ClientsRouters);
app.use(ProductsRouters);
app.use(UserRouters)

// Testa e mantém a conexão ativa
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com PostgreSQL bem-sucedida!');
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erro na conexão com PostgreSQL:', error);
  });
