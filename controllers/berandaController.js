const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Beranda = require('../models/berandaModel');
const handlerFactory = require('./handlerFactory');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.serviceAccountKey);

const storage = new Storage({
  projectId: 'project-polda',
  credentials: serviceAccount,
});

const bucketName = 'bucket-polda';

const upload = multer({
  storage: multer.memoryStorage(),
});

exports.uploadBerandaPhoto = upload.fields([
  { name: 'photo_url', maxCount: 1 },
  { name: 'logo_url', maxCount: 1 },
]);

exports.getAllKegiatan = handlerFactory.getAll(Beranda);

exports.createBeranda = catchAsync(async (req, res, next) => {
  const { telpon, lainnya, alamat } = req.body;
  const urls = {};

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const fieldname in req.files) {
    const file = req.files[fieldname][0];
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    const blob = storage.bucket(bucketName).file(filename);
    const stream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });
    stream.on('error', (err) => {
      next(new AppError(err.message, 400));
    });
    stream.on('finish', async () => {
      const url = `https://storage.googleapis.com/${bucketName}/${filename}`;
      urls[fieldname] = url;
      if (Object.keys(urls).length === Object.keys(req.files).length) {
        // All files have been uploaded
        const kegiatan = await Beranda.create({
          telpon,
          lainnya,
          alamat,
          photo_url: urls.photo_url,
          logo_url: urls.logo_url,
        });
        res.status(201).json({
          status: 'success',
          data: {
            kegiatan,
          },
        });
      }
    });
    stream.end(file.buffer);
  }
});

exports.updateBeranda = catchAsync(async (req, res, next) => {
  const { telpon, lainnya, alamat } = req.body;
  // const { files } = req;

  // Find the handicraft record by ID
  const beranda = await Beranda.findByPk(req.params.id);

  if (!beranda) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the handicraft record with the new data
  if (telpon) beranda.telpon = telpon;
  if (lainnya) beranda.lainnya = lainnya;
  if (alamat) beranda.alamat = alamat;

  await beranda.save();

  res.status(200).json({
    status: 'success',
    data: beranda,
  });
});

exports.getBeranda = handlerFactory.getOne(Beranda);

exports.deleteAssociatedFile = catchAsync(async (req, res, next) => {
  const kegiatan = await Beranda.findByPk(req.params.id);

  const filename = kegiatan.photo_url.split('/').pop();

  console.log(filename);

  if (!kegiatan) {
    return res.status(404).json({
      status: 'fail',
      message: 'kegiatan not found',
    });
  }

  // Delete the associated file from Google Cloud Storage
  const file = storage.bucket('bucket-polda').file(filename);
  await file.delete();
  next();
});

exports.deleteBeranda = handlerFactory.deleteOne(Beranda);
