require('dotenv').config();
const axios = require('axios');

const instance = axios.create({
  baseURL: process.env.API_BASE_URL,
});


module.exports = instance