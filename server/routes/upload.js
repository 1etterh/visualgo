const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3Client = require('../modules/s3Client').s3;
const express = require('express');
const router = express.Router();

router.post('/upload', async (req, res) => {
    const bucketName = 'visual-go'; // Replace with your bucket name

    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Delimiter: '/' // Important for treating the contents as hierarchical
        });

        const { CommonPrefixes } = await s3Client.send(command);

        const folders = CommonPrefixes.map(prefix => prefix.Prefix);
        console.log("Folders: ", folders);
        res.json({ folders });
    } catch (error) {
        console.error("Error listing folders: ", error);
        res.status(500).send("Failed to list folders");
    }
});

module.exports = router;
