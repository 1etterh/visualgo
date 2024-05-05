const express=require('express');
const db=require('./database/database.js');
const app = express();
const port=8080;
const path=require('path');
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}/`);
});
app.use('/',express.static(path.join(__dirname,"../client/dist")));
app.get('/',(req,res)=>{
res.sendFile(path.join(__dirname,'client/dist/index.html'));
});
db.connect((err)=>{
    if(err) throw err;
    db.query('show databases',(err,rows)=>{   
        if(err) throw err;
        console.log(rows);
    });
})  


