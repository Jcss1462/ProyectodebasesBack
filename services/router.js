const express = require('express');
const router = new express.Router();
//llamo a artista.js
const varArtista = require('../controllers/artistas.js');
const varCanciones = require('../controllers/canciones.js');

router.route('/artistas')
    .get(varArtista.get);

router.route('/canciones')
    .get(varCanciones.get);



module.exports = router;
