const express=require('express');
const app = express();
const port=8080;
const path=require('path');
const indexRouter=require('./routes/index');
const uploadRouter = require('./routes/upload');
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}/`);
});
app.use(express.json());
app.use('/',express.static(path.join(__dirname,"../client/dist")));
app.get('/',(req,res)=>{
res.sendFile(path.join(__dirname,'/client/dist/index.html'));
});

app.use('/',indexRouter);
app.use('/',uploadRouter); 


