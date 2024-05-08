const express = require('express');
const multer = require('multer');
const { s3 } = require('../modules/s3Client');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Configures multer to store files in memory

router.post('/upload', upload.array('files'), async (req, res) => {
    const userId = req.user.id;
    const dateTime = new Date().toISOString().replace(/:/g, '-'); // Safe filename date
    const folderName = `${userId}-${dateTime}`;
    const userDir = `./uploads/${folderName}`;

    try {
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }

        // Write code to a Python file
        fs.writeFileSync(`${userDir}/code.py`, req.body.code);

        // Save all files
        await Promise.all(req.files.map(file => 
            fs.promises.writeFile(path.join(userDir, file.originalname), file.buffer)
        ));

        // Upload folder to S3
        const results = await uploadFolderToS3(userDir, `${userId}/${folderName}`);

        res.send({
            message: 'Files and code uploaded successfully',
            locations: results
        });
    } catch (err) {
        console.error('Error processing upload:', err);
        res.status(500).send('Failed to process upload');
    }
});

async function uploadFolderToS3(folderPath, s3Path) {
    let results = [];
    const files = fs.readdirSync(folderPath);
    for (const fileName of files) {
        const filePath = path.join(folderPath, fileName);
        const fileBuffer = fs.readFileSync(filePath);
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `${s3Path}/${fileName}`,
                Body: fileBuffer
            }
        });
        const result = await upload.done();
        results.push(result.Location);
    }
    return results;
}

module.exports = router;
