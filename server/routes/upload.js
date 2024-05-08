const { S3Client, ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../modules/s3Client').s3;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const stream=require('stream');
const { s3 } = require('../modules/s3Client');
const upload = multer();

const bufferToStream = (binary) => {
    const duplexStream = new stream.PassThrough();
    duplexStream.end(binary);
    return duplexStream;
}


router.post('/upload',upload.array('files'), async (req, res) => {
    const bucketName = 'visual-go'; // Replace with your bucket name

    try {
        const userId = req.user.id;
        const folder = `${userId}/${new Date().toISOString()}/`; 
        await Promise.all(req.files.map(files=>{
            const fileStream = bufferToStream(file.buffer);
            const uploadParams = {
                Bucket: bucketName,
                Key: `${folder}${file.originalname}`,
                Body: fileStream
            };
            const command = new PutObjectCommand(uploadParams);
            return s3.send(command);
        }
    
    ))
    
    }catch(err){console.log(err)}
});
    
module.exports = router;