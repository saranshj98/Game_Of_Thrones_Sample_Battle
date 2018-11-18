const mongoose  = require('mongoose');
const config    = require('../config/config');

function connect() {
    mongoose.connect(config.DB_URL, { useNewUrlParser: true });
    mongoose.Promise = global.Promise;    
}


module.exports = connect()