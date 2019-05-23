//logica de la base de datos
const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery =
  `select CODIGO_IMAGEN "id_imagen",
    NOMBRE "nombre"
  from IMAGENES`;


//par filtrado

async function find(context) {
  //console.log(488888);
  let query = baseQuery;
  const binds = {};

  if (context.id) {
    //coloco el id del contexto en el bind
    binds.CODIGO_IMAGEN = context.id;

    query += `\nwhere CODIGO_IMAGEN = :CODIGO_IMAGEN`;


  }


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


  //añado la imagen a la consulta

  let cantidad = result.rows.length;
  for (let idx = 0; idx < cantidad; idx++) {
    let cod = result.rows[idx].id_imagen;
    result.rows[idx].imagen_principal = await findImage(cod, context);
  }
  console.log(result);
  return result.rows;
}



module.exports.find = find;

let tmp = `BEGIN :imgBase64 := base64encode_Imagenes(:cod,'null'); END;`;

let selectImageBase64Sql = `BEGIN :imgBase64 := base64encode_Imagenes(:cod,'`;

async function findImage(id, context) {

  let verb = selectImageBase64Sql;

  if (!context.sx && !context.sy && !context.col&&!context.cali) {
    verb = verb + "null'); END;";
  } else {

    if ((context.sx || context.sy) && (!context.col||!context.cali)) {
      verb = verb + "maxscale=" + context.sx + " " + context.sy + "'); END;";
    } else if(context.sx &&context.sy && context.col){
      verb = verb + "maxscale=" + context.sx + " " + context.sy;
    }

    if (context.col&&!context.cali) {
      if (context.col == "rojo") {
        verb = verb + ' gamma="2.5""0.1""0.1"' + "'); END;";
      }
      if (context.col == "azul") {
        verb = verb + ' gamma="0.1""0.1""2.5"' + "'); END;";
      }
      if (context.col == "verde") {
        verb = verb + ' gamma="0.1""2.5""0.1"' + "'); END;";
      }
    }else if(context.col&&context.cali){


      if (context.col == "rojo") {
        verb = verb + ' gamma="2.5""0.1""0.1"';
      }
      if (context.col == "azul") {
        verb = verb + ' gamma="0.1""0.1""2.5"';
      }
      if (context.col == "verde") {
        verb = verb + ' gamma="0.1""2.5""0.1"';
      }
    }

    if(context.cali){

      if (context.cali == "media") {
        verb = verb + ' compressionQuality=MEDCOMP'+ "'); END;";;
      }
      if (context.cali == "alta") {
        verb = verb + ' compressionQuality=MAXCOMPRATIO'+ "'); END;";;
      }
      if (context.cali == "baja") {
        verb = verb + ' compressionQuality=LOWCOMP'+ "'); END;";;
      }

    }



  }




  console.log('edicion=' + verb);
  const binds = {};
  binds.cod = id;
  binds.imgBase64 = { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500000 };
  const result = await database.simpleExecute(verb, binds);
  return result.outBinds;
}