const http = require('http');
const app = require('./app');
const initDB = require('./init-db');

async function start() {
    await initDB();

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
