const express = require('express')
const mysql = require('mysql')
require('dotenv').config()
const connection = mysql.createConnection({

host : process.env.RDS_HOSTNAME,

user: process.env.RDS_USERNAME,

password : process.env.RDS_PASSWORD,

port: process.env.RDS_PORT,


});

module.exports=connection;
// Path: server/database/database.js