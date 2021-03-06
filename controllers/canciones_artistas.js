const artistas = require('../db_apis/canciones_artistas');

//funcion get de la tabla artistas
async function get(req, res, next) {
  try {
    const context = {};

    //le doy un id al contexto segun lo que viene en el req
    context.artid = req.query.artid;

    context.genero = req.query.genero;

   
    ///retricciones
    context.skip = parseInt(req.query.skip, 10);
    context.limit = parseInt(req.query.limit, 10);

  
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

