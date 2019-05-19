const database = require('../services/database.js');
const oracledb = require('oracledb');
 
const baseQuery = 
 `select CODIGO_CANCION "id",
    TITULO "titulo",
    LETRA "letra"
  from CANCIONES`;
 
async function find(context) {

  console.log(context);
  let query = baseQuery;
  const binds = {};
 
  if (context.id) {
    binds.CODIGO_CANCION = context.id;
 
    query += `\nwhere CODIGO_CANCION = :CODIGO_CANCION`;
  }
 
  let result = await database.simpleExecute(query, binds);

  let cantidad=result.rows.length;
  for(let idx=0;idx<cantidad;idx++){
    let cod=result.rows[idx].id;
    result.rows[idx].imagen_cancion=await findImage(cod);
  }
  console.log(result);

  return result.rows;
}
 
module.exports.find = find;


const selectImageBase64Sql =
    `BEGIN :imgBase64 := base64encode_songs(:cod); END;`;

async function findImage(id) {
console.log('Query image start');
    const binds = {};
    binds.cod = id;
    binds.imgBase64 = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500000 };
    const result = await database.simpleExecute(selectImageBase64Sql, binds);
    return result.outBinds;
}