const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();


app.use(cors());
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({extended: false}));


const roadmapRouter = require("./routers/roadmap");
const indexRouter = require("./routers/index");
const skillRouter = require('./routers/skill');
const gptRouter = require("./routers/gpt");
const fieldRouter = require("./routers/field");

app.use("/", indexRouter);
app.use("/roadmap", roadmapRouter);
app.use("/skill", skillRouter);
app.use("/gpt", gptRouter);
app.use("/field", fieldRouter);

// 왜 연결이 되지 않을까?
//const MongoClient = require("mongodb").MongoClient;
//MongoClient.connect("mongodb://127.0.0.1:27017/campuscrew",function(error, client){
//    console.log(error);
//    console.log(client);
//})


//mongodb://127.0.0.1:27017/campuscrew
mongoose.connect(process.env.MONGODB_URL);
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});


const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`[+] Server is running on ${PORT}`);
});