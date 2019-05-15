//logica de la base de datos
const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery =
  `select CODIGO_CANCION "cancion_id",
    TITULO "titulo"
   from Artistas natural join CANCIONES_ARTISTAS natural join CANCIONES`;

//par filtrado

async function find(context) {
  //console.log(488888);
  let query = baseQuery;
  const binds = {};


  if (context.artid) {
    //coloco el id del contexto en el bind
    binds.CODIGO_ARTISTA = context.artid;

    query += `\nwhere CODIGO_ARTISTA = :CODIGO_ARTISTA`;
  }


  if (context.genero&&!context.artid) {
    //coloco el id del contexto en el bind
    binds.GENERO = context.genero;

    query += `\nwhere GENERO = :GENERO`;
  }


  console.log(query);



  //////////////////////////////////restriccines de paginacion


  if (context.skip) {
    binds.row_offset = context.skip;

    query += '\noffset :row_offset rows';
  }

  const limit = (context.limit > 0) ? context.limit : 30;

  binds.row_limit = limit;

  query += '\nfetch next :row_limit rows only';

  //////////////////////////////////////////////////////////////////

  const result = await database.simpleExecute(query, binds);

  console.log(result);
  return result.rows;
}

module.exports.find = find;

