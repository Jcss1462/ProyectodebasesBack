const artistas = require('../db_apis/artistas.js');

//funcion get de la tabla artistas
async function get(req, res, next) {
  try {
    const context = {};

    //le doy un id al contexto segun lo que viene en el req
    context.id = req.query.id;

   
    ///retricciones
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);

    //clasificacion  
    context.sort = req.query.sort;


    ///////filtrado
    context.genero =req.query.genero;
    

    //busca lo enviado
    const rows = await artistas.find(context);

    console.log(rows.length);
    

    if (req.params.id) {
      if (rows.length === 1) {
        //se encoontro y lo devuelve como json

        res.status(200).json(rows[0]);
      } else {
        //si no se encontro
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

// se exporrta para usarla en el modulo
module.exports.get = get;

////////////////////////////////////////////////////////////////////////////////post


function getEmployeeFromRec(req) {
  const artistaarr = {
    nombre: req.body.nombre,
    genero: req.body.genero
  };

  return artistaarr;
}

async function post(req, res, next) {
  try {
    //declaro un arreglo segun lo que me devolvio la pagina
    let newartist = getEmployeeFromRec(req);

    console.log(45555555555555555555555);

    newartist = await artistas.create(newartist);

    res.status(201).json(newartist);
  } catch (err) {
    next(err);
  }
}

module.exports.post = post;

//////////////////////////////////////////////////////////////////////put

async function put(req, res, next) {
  try {
    let updateArtist = getEmployeeFromRec(req);

    updateArtist.id = parseInt(req.params.id, 10);

    updateArtist = await artistas.update(updateArtist);

    if (updateArtist !== null) {
      res.status(200).json(updateArtist);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;


//////////////////////////////////////////////////////////////delate
async function del(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await artistas.delete(id);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.delete = del;
