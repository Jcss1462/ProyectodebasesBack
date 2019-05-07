//logica de la base de datos
const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery =
  `select CODIGO_ARTISTA "id",
    NOMBRE "nombre",
    GENERO "genero",
    dbms_lob.substr( BIOGRAFIA, 4000, 1 )"biografia"
  from ARTISTAS`;


//par filtrado
const sortableColumns = ['CODIGO_ARTISTA', 'NOMBRE', 'GENERO'];

async function find(context) {
  //console.log(488888);
  let query = baseQuery;
  const binds = {};


  if (context.id) {
    //coloco el id del contexto en el bind
    binds.CODIGO_ARTISTA = context.id;

    query += `\nwhere CODIGO_ARTISTA = :CODIGO_ARTISTA`;

    if (context.genero) {
      binds.genero = context.genero;

      query += '\nand GENERO = :GENERO';
    }

  }

  if (context.genero && !context.id) {
    binds.genero = context.genero;

    query += '\nwhere GENERO = :GENERO';
  }


  console.log(query);


  /////////////////////////////////////////clasificacion


  if (context.sort === undefined) {
    query += '\norder by GENERO asc';
  } else {
    let [column, order] = context.sort.split(':');

    if (!sortableColumns.includes(column)) {
      throw new Error('Invalid "sort" column');
    }

    if (order === undefined) {
      order = 'asc';
    }

    if (order !== 'asc' && order !== 'desc') {
      throw new Error('Invalid "sort" order');
    }

    query += `\norder by "${column}" ${order}`;
  }


  /////////////////////////////////////////////////////


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

