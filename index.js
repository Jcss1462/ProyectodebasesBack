const webServer = require('./services/web-server.js');



// dtos de la base de datos

const database = require('./services/database.js');

//configuracion de la base de datos
const dbConfig = require('./config/database.js');
const defaultThreadPoolSize = 4;

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = dbConfig.proyecto.poolMax + defaultThreadPoolSize;



//funcion que inicia el servidor
async function startup() {
    console.log('Starting application');

    //prueba de la base de datos
    try {
        console.log('Initializing database module');

        await database.initialize();
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }

    //inicio el servidor
    try {
        console.log('Initializing web server module');

        await webServer.initialize();
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }
}

startup();

//funcion que apaga el servidor
async function shutdown(e) {
    let err = e;

    console.log('Shutting down');

    //apago el sevidor
    try {
        console.log('Closing web server module');

        await webServer.close();
    } catch (e) {
        console.log('Encountered error', e);

        err = err || e;
    }

    //apago la base de datos
    try {
        console.log('Closing database module');

        await database.close();
    } catch (err) {
        console.log('Encountered error', e);

        err = err || e;
    }

    console.log('Exiting process');

    if (err) {
        process.exit(1); // Non-zero failure code
    } else {
        process.exit(0);
    }
}

process.on('SIGTERM', () => {
    console.log('Received SIGTERM');

    shutdown();
});

process.on('SIGINT', () => {
    console.log('Received SIGINT');

    shutdown();
});

process.on('uncaughtException', err => {
    console.log('Uncaught exception');
    console.error(err);

    shutdown(err);
});