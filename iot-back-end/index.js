const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

dotenv.config();
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

const Log = mongoose.model('Log', { temp: Number, hum: Number, addr: Number,sig: Number, unix: Number, db: Number });

setInterval(()=>{
  var filteredFiles = [];
  const dir = '../CC1101/';
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if(file.includes("sensor")){
      filteredFiles.push(file);
    }
  }

  filteredFiles.forEach(f => {
    fs.readFile(`../CC1101/${f}`, 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let log = {
        temp: parseInt(data.split(":")[0]),
        hum: parseInt(data.split(":")[1]),
        addr: parseInt(data.split(":")[2]),
        sig: parseInt(data.split(":")[3]),
        unix: data.split(":")[4],
        db: mongoose.connection.readyState
      }
      Log.find({addr: parseInt(log.addr)}).sort({ _id: -1 }).limit(1).exec((err,res)=>{
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
  })
},5000)
const getValues = async filteredFiles =>{
  return Promise.all(
    filteredFiles.map(f => fsPromise.readFile(`../CC1101/${f}`, "utf-8"))
  )
}
app.use(express.static(path.join('/home/pi/Desktop/Server/', 'iot-front-end/dist'))); //  "public" off of current is root
app.get('/api/temp', async (req, res)=>{
  var sensorArr = [];
  let sensor;
  let filteredFiles = [];
  const dir = '../CC1101/';
  const files = fs.readdirSync(dir)
  for (const file of files) {
    if(file.includes("sensor")){
      filteredFiles.push(file);
    }
  }
  let values = await getValues(filteredFiles) 
  
  for(v of values){
    sensor = {
      temp: parseInt(v.split(":")[0]),
      hum: parseInt(v.split(":")[1]),
      addr: parseInt(v.split(":")[2]),
      sig: parseInt(v.split(":")[3]),
      unix: v.split(":")[4],
    }
    sensorArr.push(sensor);
  }

  res.json(sensorArr)
})
app.get('/api/daily', (req, res)=>{
  let n = Math.round(Date.now()/1000);
  let sInterval = 6 * 60 * 60;
  let interval = n - sInterval;
  Log.find({ unix: { $gte: interval, $lte: n} }, {_id: 0, db: 0, __v: 0}).sort({ unix: 1,}).exec((err,result)=>{
    if(err){
      res.status(500);
      return
    }
    res.status(200).json(result);
    return
  });
});
app.get('/api/graph', (req, res)=>{
  let n = Math.round(Date.now()/1000);
let hInterval = req.query.interval;
let sampleT = req.query.sample;
if(!(hInterval >= 0 && hInterval <= 24)){
  res.status(400).send("Interval out of the bounds");
  return
}
if(sampleT == 0){
  res.status(400).send("Sample out of the bounds");
  return
}

let sInterval = hInterval * 60 * 60;
  let interval = n - sInterval;
  Log.find({ unix: { $gte: interval, $lte: n} }, {_id: 0, db: 0, __v: 0}).sort({ unix: 1,}).exec((err2,result2)=>{
    if(err2){
      res.status(500);
    }
    let arr = new Array(sInterval/sampleT);
    let index = 0;
    console.log(n - sInterval, result2[0].unix)
    if(index < 0){
        res.status(200).send("No Data")
        return
    }
    let br = 0;
    let j = 0;
    let temp = result2[index];
    for(let i = sInterval; i > 0; i--){
      if(n-i == result2[index].unix){ 
          //arr[j] = result2[index];
          temp = result2[index]
          if(index < result2.length-1) index++;
      }
      if(i%sampleT==0){
          br++;
          arr[j] = {
              temp: temp.temp,
              unix: n-i
          }
          j++;
      }
    }
    res.json(arr);
  })      
})

app.listen(8080);
console.log('Listening on port 8080');