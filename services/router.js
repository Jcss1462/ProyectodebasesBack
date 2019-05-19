const express = require('express');
const router = new express.Router();
//llamo a artista.js
const varArtista = require('../controllers/artistas.js');
const varCanciones = require('../controllers/canciones.js');
const varAlbumes = require('../controllers/albumes');
const varCancionesArtistas = require('../controllers/canciones_artistas');
const varAlbumesArtistas = require('../controllers/albumes_artistas');

router.route('/artistas')
    .get(varArtista.get);

router.route('/canciones')
    .get(varCanciones.get);

router.route('/albumes')
    .get(varAlbumes.get);

router.route('/cancionesartistas')
    .get(varCancionesArtistas.get);

router.route('/albumesartistas')
    .get(varAlbumesArtistas.get);

module.exports = router;
