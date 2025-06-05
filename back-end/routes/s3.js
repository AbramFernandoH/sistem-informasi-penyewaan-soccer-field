const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const app = express();
const port = 8080;

const regionName = 'ap-southeast-2'
const bucketName = 'goedang-futsal-bucket'

const s3Client = new S3Client({
    region: regionName, // Replace with your preferred region
    credentials: {
        accessKeyId: 'AKIA5LO4GY42ISQ2UOVG',
        secretAccessKey: 'XXPJA8BvibMRiTJKcNRLyBnuGJuFhMveNpwF0SYq',
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

// ✅ Enable CORS for localhost:3000
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/health', (req, res) => {
    res.json({ message: 'api connected' });
});

app.get('/image/:filename', (req, res) => {
    const { filename } = req.params;

    // Construct the public URL manually (works if bucket is public)
    const url = `https://${bucketName}.s3.${regionName}.amazonaws.com/${filename}`;

    res.json({ imageUrl: url });
});

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        message: 'Image uploaded successfully',
        fileUrl: req.file.location,
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

