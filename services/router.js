const express = require('express');
const router = new express.Router();
//llamo a artista.js
const varArtista = require('../controllers/artistas.js');
const varCanciones = require('../controllers/canciones.js');

router.route('/artistas')
    .get(varArtista.get)
   // .post(varArtista.post)
   // .put(varArtista.put)
    .delete(varArtista.delete);

router.route('/canciones')
    .get(varCanciones.get);



module.exports = router;
