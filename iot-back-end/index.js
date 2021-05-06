const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

const Log = mongoose.model('Log', { temp: Number, unix: Number, db: Number });

setInterval(()=>{
  fs.readFile('../CC1101/example.txt', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let log = {
      temp: parseInt(data.split(":")[0]),
      unix: data.split(":")[1],
      db: mongoose.connection.readyState
    }
    Log.find().sort({ _id: -1 }).limit(1).exec((err,res)=>{
      if(res.length === 0){
        const nLog = new Log(log);
        nLog.save();
        return
      }
      if(res.length > 0 && res[0].temp != parseInt(log.temp)){
        console.log("saved")
        const nLog = new Log(log);
        nLog.save();
      }
    })
  })
},5000)

app.use(express.static(path.join('/home/pi/Desktop/Server/', 'iot-front-end/dist'))); //  "public" off of current is root
app.use(cors());
app.get('/api/temp', (req, res)=>{
  Log.find().sort({ _id: -1 }).limit(1).exec((err,result)=>{
    if(err){
      res.status(500);
    }
    res.json(result[0]);
  })      
})
app.get('/api/graph', (req, res)=>{
  Log.find().sort({ _id: -1, unix: 1 }).limit(1).exec((err,result)=>{
    let interval = result[0].unix - 86400;
    Log.find({ unix: { $gte: interval, $lte: result[0].unix} }, {_id: 0, db: 0, __v: 0}).sort({ unix: 1,}).exec((err2,result2)=>{
      if(err){
        res.status(500);
      }
      res.json(result2);
    })
  })      
})

app.listen(8080);
console.log('Listening on port 8080');