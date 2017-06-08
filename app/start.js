const http = require('http');
const app = require('./app');
const db = require('./db');

async function start() {
    await db.authenticate();

    const server = http.createServer(app);

    server.listen(app.get('port'));
}

start()
    .then(() => {
        console.log(`Server now running on port ${app.get('port')}`);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
