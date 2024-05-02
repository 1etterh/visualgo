
const express=require('express');

const app = express();

const port=8080;

const path=require('path');

app.listen(port, () => {

console.log(`Server running at http://localhost:${port}/`);

});

console.log(path.__dirname)

app.use('/',express.static(path.join(__dirname,"../client/dist")));

app.get('/',(req,res)=>{

res.sendFile(path.join(__dirname,'client/dist/index.html'));

});