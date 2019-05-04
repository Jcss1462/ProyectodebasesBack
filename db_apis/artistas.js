//logica de la base de datos
const database = require('../services/database.js');
const oracledb = require('oracledb');

const baseQuery =
  `select CODIGO_ARTISTA "id",
    NOMBRE "nombre",
    GENERO "genero",
    BIOGRAFIA "biografia"
  from ARTISTAS
  where 1 = 1`;


//par filtrado
const sortableColumns = ['CODIGO_ARTISTA', 'NOMBRE', 'GENERO'];

async function find(context) {
  //console.log(488888);
  let query = baseQuery;
  const binds = {};

  console.log(context.id);
  if (context.id) {
    //coloco el id del contexto en el bind
    binds.CODIGO_ARTISTA = context.id;

    query += `\nwhere CODIGO_ARTISTA = :CODIGO_ARTISTA`;
  }

  if (context.genero) {
    binds.genero = context.genero;
 
    query += '\nand genero = :genero';
  }

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


////post
const createSql =
  `insert into ARTISTAS (
  NOMBRE,
  GENERO,
  ) values (
    :nombre,
    :genero
  ) returning CODIGO_ARTISTA
  into :CODIGO_ARTISTA`;

async function create(emp) {
  const newartist = Object.assign({}, emp);

  newartist.CODIGO_ARTISTA = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  }



  const result = await database.simpleExecute(createSql, newartist);

  newartist.CODIGO_ARTISTA = result.outBinds.employee_id[0];

  return newartist;
}

module.exports.create = create;


///put
const updateSql =
  `update ARTISTAS
  set NOMBRE = :NOMBRE,
  GENERO = :GENERO
  where CODIGO_ARTISTA = :CODIGO_ARTISTA`;

async function update(emp) {
  const updatartist = Object.assign({}, emp);
  const result = await database.simpleExecute(updateSql, updatartist);

  if (result.rowsAffected && result.rowsAffected === 1) {
    return updatartist;
  } else {
    return null;
  }
}

module.exports.update = update;


///delate

const deleteSql =
  `begin
 
    
    delete from ARTISTAS
    where CODIGO_ARTISTA = :CODIGO_ARTISTA;
 
    :rowcount := sql%rowcount;
 
  end;`

async function del(id) {
  const binds = {
    CODIGO_ARTISTA: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  }
  const result = await database.simpleExecute(deleteSql, binds);

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;