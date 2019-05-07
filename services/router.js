const express = require('express');
const router = new express.Router();
//llamo a artista.js
const varArtista = require('../controllers/artistas.js');
const varCanciones = require('../controllers/canciones.js');
const varCancionesArtistas = require('../controllers/canciones_artistas');

router.route('/artistas')
    .get(varArtista.get);

router.route('/canciones')
    .get(varCanciones.get);

router.route('/cancionesartistas')
    .get(varCancionesArtistas.get);

module.exports = router;
