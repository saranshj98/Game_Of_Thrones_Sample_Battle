const routes    = require('express').Router();
const battles   = require('./battles');

routes.use('/battles', battles);

module.exports = routes;