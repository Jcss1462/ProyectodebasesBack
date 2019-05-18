const database = require('../services/database.js');
 
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
 
  const result = await database.simpleExecute(query, binds);
 
  return result.rows;
}
 
module.exports.find = find;