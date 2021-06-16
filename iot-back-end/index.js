const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}

dotenv.config();
app.use(cors(corsOptions));
app.use(express.json())

mongoose.connect(process.env.MONGO, {useNewUrlParser: true, useUnifiedTopology: true});

const Log = mongoose.model('Log', { temp: Number, hum: Number, name: String, addr: Number,sig: Number, unix: Number });

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
        db: mongoose.connection.readyStrate
      }

      Log.updateOne( {addr: log.addr}, log, { upsert : true }, (err, res)=>{
        if(err){
          console.log("Error: ", err);
          return;
        }
      });
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
  let time = (Date.now() / 1000) - 60 * 5
  Log.find({unix: {$gte: time}},(err, docs)=>{
    if(err){
      console.log(err);
      res.status(500);
      return;
    }
    res.json(docs);
    return
  })
})

app.post('/api/update-name', async (req, res)=>{
  let {id, name} = req.body;
  console.log(id, name);
  let mId = mongoose.Types.ObjectId(id);
  Log.updateOne( {_id: mId}, {name: name}, (err, resu)=>{
    if(err){
      console.log("Error: ", err);
      res.status(500).send(err);
    }
    console.log(resu.MatchedCount);
  });
  res.status(200).send("Updated");
  return
})
app.listen(8080);
console.log('Listening on port 8080');