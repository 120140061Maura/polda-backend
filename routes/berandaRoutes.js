const express = require('express');

const router = express.Router();

const berandaController = require('../controllers/berandaController');

router
  .route('/')
  .get(berandaController.getAllKegiatan)
  .post(berandaController.uploadBerandaPhoto, berandaController.createBeranda);

router
  .route('/:id')
  .get(berandaController.getBeranda)
  .patch(berandaController.uploadBerandaPhoto, berandaController.updateBeranda)
  .delete(
    berandaController.deleteAssociatedFile,
    berandaController.deleteBeranda
  );

module.exports = router;
