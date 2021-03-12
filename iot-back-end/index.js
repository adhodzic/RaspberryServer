const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
//app.use(express.static(__dirname)); // Current directory is root
console.log(path.join('/home/pi/Desktop/Server/', 'iot-front-end/dist'));
app.use(express.static(path.join('/home/pi/Desktop/Server/', 'iot-front-end/dist'))); //  "public" off of current is root

app.get('/api/temp', (req, res)=>{
    fs.readFile('../CC1101/example.txt', 'utf8' , (err, data) => {
        if (err) {
            res.status(500)
          console.error(err)
          return
        }
        res.json({
            temp: data
        });
      })
    
})

app.listen(8080);
console.log('Listening on port 8080');