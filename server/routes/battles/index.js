const battles   = require('express').Router();
const get       = require('./get');
const post      = require('./post');

battles.get('/count', get.count);
battles.get('/stats', get.stats);
battles.get('/list', get.list);
battles.get('/search', get.search);

module.exports = battles;