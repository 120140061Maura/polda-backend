const express = require('express');

const router = express.Router();

const tentangController = require('../controllers/tentangController');

router
  .route('/')
  .get(tentangController.getAllTentang)
  .post(tentangController.uploadTentang, tentangController.createTentang);

router
  .route('/:id')
  .get(tentangController.getTentang)
  .patch(tentangController.uploadTentang, tentangController.updateTentang)
  .delete(
    tentangController.deleteAssociatedFile,
    tentangController.deleteTentang
  );

module.exports = router;
