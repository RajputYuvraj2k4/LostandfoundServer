const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lost_and_found', 
    allowed_formats: ['jpeg', 'png', 'jpg'], // Supported formats
  },
});

const upload = multer({ storage });

module.exports = upload;
