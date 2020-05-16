const express = require('express');
const app = express();
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://arkhan:abik0786@blog-d9fao.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser:true
}).then(()=>console.log("connected db")).catch(err=>console.log(err))

app.get('/',(req,res)=>{
    res.send("welcome to my blog")
})

console.log('try')
app.listen(5000)