const canciones = require('../db_apis/canciones.js');
 
async function get(req, res, next) {
  try {
    const context = {};
 
    context.id = req.query.id;

    if(req.query.filename){
      context.filename=req.query.filename;
    }
 
    const rows = await canciones.find(context);
 
    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}
 
module.exports.get = get;