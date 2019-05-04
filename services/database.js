const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');

//inicializo la base de datos
async function initialize() {
    const pool = await oracledb.createPool(dbConfig.proyecto);
}

module.exports.initialize = initialize;

//cierro la base de datos
async function close() {
    await oracledb.getPool().close();
}

module.exports.close = close;

//ejecutar conexion con la bd
function simpleExecute(statement, binds = [], opts = {}) {
    //obtener conexion
    return new Promise(async (resolve, reject) => {
      let conn;
   
      opts.outFormat = oracledb.OBJECT;
      opts.autoCommit = true;
   
      try {
        conn = await oracledb.getConnection();

      
   
        const result = await conn.execute(statement, binds, opts);
   
        console.log(binds);
        
        resolve(result);
        
      } catch (err) {
        reject(err);

        //cerrar conexiom
      } finally {
        if (conn) { // conn assignment worked, need to close
          try {
            await conn.close();
          } catch (err) {
            
            console.log(err);
          }
        }
      }
    });
  }
   
  module.exports.simpleExecute = simpleExecute;
  