const express = require('express');
const {S3Client} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const router = express.Router();

const regionName = process.env.AMAZON_S3_REGION_NAME
const bucketName = process.env.AMAZON_S3_BUCKET_NAME

const s3Client = new S3Client({
    region: regionName, // Replace with your preferred region
    credentials: {
        accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AMAZON_S3_SECRET_ACCESS_KEY,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

router.get('/image/:filename', (req, res) => {
    const { filename } = req.params;

    // Construct the public URL manually (works if bucket is public)
    const url = `https://${bucketName}.s3.${regionName}.amazonaws.com/${filename}`;

    res.json({ imageUrl: url });
});

router.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Image uploaded successfully',
        fileUrl: req.file.location,
    });
});

module.exports = router;
