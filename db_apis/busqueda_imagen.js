//logica de la base de datos
const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery =
`select CODIGO_IMAGEN "id_imagen",
CODIGO_ARTISTA "id_artista",
NOMBRE "nombre"
from ARTISTAS_IMAGENES natural join IMAGENES`;



//par filtrado
async function find(context) {
  //console.log(488888);
  let query = baseQuery;
  const binds = {};

  
  console.log(query);
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

  let result = await database.simpleExecute(query, binds);
  let filtro= new Array;


  //añado la imagen a la consulta

  let cantidad = result.rows.length;
  let indice=0;
  for (let idx = 0; idx < cantidad; idx++) {
    let cod = result.rows[idx].id_imagen;
    //let id=result.rows[idx].id_artista;

    result.rows[idx].parecido= await compare(cod, context);
    result.rows[idx].imagen=await findImage(cod);

    if(result.rows[idx].parecido.num==1){
      filtro.push(result.rows[idx]);
      indice++;
    }

  }
  console.log(result);
  console.log("Filtro");
  console.log(filtro);
  return filtro;
}

module.exports.find = find;

const similitud =
    `BEGIN :num := BUSCA_IMAGEN(:cod,:filename); END;`;
async function compare(id,context) {
console.log('Query image start');
    const binds = {};
    binds.cod = id;
    binds.filename=context.filename;
    binds.num = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER, maxSize: 500000 };
    const result = await database.simpleExecute(similitud, binds);
    return result.outBinds;
}

const selectImageBase64Sql =
    `BEGIN :imgBase64 := base64encode_Imagenes(:cod,'null','null'); END;`;

async function findImage(id) {
console.log('Query image start');
    const binds = {};
    binds.cod = id;
    binds.imgBase64 = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500000 };
    const result = await database.simpleExecute(selectImageBase64Sql, binds);
    return result.outBinds;
}