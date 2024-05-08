const express = require('express');
const multer = require('multer');
const { s3 } = require('../modules/s3Client');
const { Upload } = require('@aws-sdk/lib-storage');
require('dotenv').config();

const router = express.Router();
const upload = multer(); // Configures multer to store files in memory


router.post('/upload', upload.array('files'), async (req, res) => {
    try {
        const results = await Promise.all(
            req.files.map(file => uploadFileToS3(file))
        );
        res.send({
            message: 'Files uploaded successfully',
            locations: results
        });
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).send('Failed to upload files');
    }
});

async function uploadFileToS3(file) {
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer // Since multer is configured to store files in memory
        }
    });

    // Wait for the upload to finish
    const result = await upload.done();
    return result.Location; // Returns the URL of the uploaded file
}

module.exports = router;
