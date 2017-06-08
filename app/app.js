const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');

const app = express();

app.set('port', config.PORT);
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static(config.paths.static));

if (process.env.NODE_ENV !== 'production') {
    // Allow cross-origin resource sharing on development.
    app.use(cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['*'],
    }));
}

module.exports = app;
