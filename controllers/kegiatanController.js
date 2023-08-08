const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Kegiatan = require('../models/kegiatanModel');
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

exports.uploadKegiatanPhoto = upload.single('photo_url');

exports.getAllKegiatan = handlerFactory.getAll(Kegiatan);

exports.createKegiatan = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  const { file } = req;
  console.log(title, description, file);
  // Generate a unique filename for the uploaded file
  const filename = `${uuidv4()}${path.extname(file.originalname)}`;

  // Upload the file to Google Cloud Storage
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(filename);
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
    // Construct the URL for the uploaded file
    const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

    const kegiatan = await Kegiatan.create({
      title,
      description,
      photo_url: url,
    });

    res.status(201).json({
      status: 'success',
      data: {
        kegiatan,
      },
    });
  });
  stream.end(file.buffer);
});

exports.updateKegiatan = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  const { file } = req;

  // Find the handicraft record by ID
  const kegiatan = await Kegiatan.findByPk(req.params.id);

  console.log(title);

  if (!kegiatan) {
    return next(new AppError('No document found with that ID', 404));
  }

  // Update the handicraft record with the new data
  if (title) kegiatan.title = title;
  if (description) kegiatan.description = description;
  if (file) {
    // Generate a unique filename for the uploaded file
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;

    // Upload the file to Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(filename);
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
      // Construct the URL for the uploaded file
      const url = `https://storage.googleapis.com/${bucketName}/${filename}`;

      // Update the handicraft record with the uploaded file URL
      kegiatan.photo_url = url;
      await kegiatan.save();
    });
    stream.end(file.buffer);
  }

  await kegiatan.save();

  res.status(200).json({
    status: 'success',
    data: kegiatan,
  });
});

exports.getKegiatan = handlerFactory.getOne(Kegiatan);

exports.deleteAssociatedFile = catchAsync(async (req, res, next) => {
  const kegiatan = await Kegiatan.findByPk(req.params.id);

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

exports.deleteKegiatan = handlerFactory.deleteOne(Kegiatan);
