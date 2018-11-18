const express       = require("express")
const mongoose      = require('mongoose')
const cors          = require('cors')
const bodyParser    = require('body-parser')
const helmet        = require('helmet')
const routes        = require('./routes/')
const connectMongo 	= require('./helper/db');
const config       	= require('./config/config');
const app           = express()
const router        = express.Router()



/** set up middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(helmet())
app.use('/api', routes)

app.get('/', (req, res) => {
	var err = new Error('Not found');
	res.status(404);
	res.send(err);
})

// start server
const port = process.env.PORT ? process.env.PORT : 8080;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

// FOR TESTING ==========================
module.exports = app