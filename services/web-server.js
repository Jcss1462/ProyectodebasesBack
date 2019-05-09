const http = require('http');
const express = require('express');
//modulo para el registro http
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');


//enrrutador de metodos
const router = require('./router.js');

let httpServer;

//inicializo el servidor
function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);

        // Combines logging info from request and response// actualiza cada vez que actualizo la pagina
        app.use(morgan('combined'));

        //permisos
        app.use(enableCORS);


        // Parse incoming JSON requests and revive JSON.
        app.use(express.json({
            reviver: reviveJson
        }));

        //configuro las respuestas
        app.use('/api', router);

        httpServer.listen(webServerConfig.port)
            .on('listening', () => {
                console.log(`Web server listening on localhost:${webServerConfig.port}`);

                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
}

module.exports.initialize = initialize;

//cierro el servidor
function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

module.exports.close = close;

///conversor



const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
 
function reviveJson(key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === 'string' && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}

function enableCORS(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}