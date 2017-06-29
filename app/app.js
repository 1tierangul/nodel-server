const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const inmemoryDB = require('./inmemory-db');
const extendSession = require('./middlewares/extend-session');
const userCtrl = require('./controllers/user');
const photoCtrl = require('./controllers/photo');
const config = require('./config');

const app = express();

app.set('port', config.PORT);
app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser(config.SECRET));
app.use(session({
    secret: config.SECRET,
    store: new RedisStore({
        client: inmemoryDB,
    }),
    saveUninitialized: false,
    resave: false,
}));
app.use(express.static(config.paths.static));

if (process.env.NODE_ENV !== 'production') {
    // Allow cross-origin resource sharing on development.
    app.use(cors({
        origin: ['http://localhost:4200'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    }));
}

app.use(extendSession);

app.use('/api/user', userCtrl);
app.use('/api/photo', photoCtrl);

module.exports = app;
