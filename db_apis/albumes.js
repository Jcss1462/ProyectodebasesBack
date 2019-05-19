//logica de la base de datos
const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery =
  `select CODIGO_ALBUM "id",
    NOMBRE_ALBUM "nombre_album"  
   from albumes`;


async function find(context) {
  //console.log(488888);
  let query = baseQuery;
  const binds = {};

  console.log("prueba de llegada2= "+context.albid);

  if (context.albid) {
    //coloco el id del contexto en el bind
    binds.CODIGO_ALBUM = context.albid;

    query += `\nwhere CODIGO_ALBUM = :CODIGO_ALBUM`;
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

  let result = await database.simpleExecute(query, binds);

  let cantidad=result.rows.length;
  for(let idx=0;idx<cantidad;idx++){
    let cod=result.rows[idx].id;
    result.rows[idx].imagen_album=await findImage(cod);
  }
  console.log(result);

  //console.log(result);
  return result.rows;
}

module.exports.find = find;


const selectImageBase64Sql =
    `BEGIN :imgBase64 := base64encode_album(:cod); END;`;

async function findImage(id) {
console.log('Query image start');
    const binds = {};
    binds.cod = id;
    binds.imgBase64 = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 5000000 };
    const result = await database.simpleExecute(selectImageBase64Sql, binds);
    return result.outBinds;
}
