const express = require('express');

const router = express.Router();

const kegiatanController = require('../controllers/kegiatanController');

router
  .route('/')
  .get(kegiatanController.getAllKegiatan)
  .post(
    kegiatanController.uploadKegiatanPhoto,
    kegiatanController.createKegiatan
  );

router
  .route('/:id')
  .get(kegiatanController.getKegiatan)
  .patch(
    kegiatanController.uploadKegiatanPhoto,
    kegiatanController.updateKegiatan
  )
  .delete(
    kegiatanController.deleteAssociatedFile,
    kegiatanController.deleteKegiatan
  );

module.exports = router;
