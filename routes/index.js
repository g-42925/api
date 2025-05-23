var uuid = require('uuid')
var fs = require('fs');
var cors = require('cors')
var path = require('path');
var express = require('express');
var app = express()

var dbPath = path.join('public/db', 'db.json');

app.use(
  cors({
    credentials:true,
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:[
      'Content-Type',
      'Authorization',
      'ngrok-skip-browser-warning'
    ],
    origin:[
      'http://localhost:4200',
      'https://flashcard-pied-eta.vercel.app',
      'https://4200-firebase-flashcard-1747711336446.cluster-htdgsbmflbdmov5xrjithceibm.cloudworkstations.dev'
    ]
  })
)

/* GET home page. */
app.get('/',function(req,res,next) {
  var db = fs.readFileSync(dbPath);
  res.json(JSON.parse(db))
});

app.get('/test',function(req,res,next) {
  res.json({works:true})
});

app.post('/',(req, res) => {
  var id = uuid.v4()
  var date = new Date()
  var month = date.getMonth() + 1
  var _date = date.getDate()
  var addedAt = `2025${month}${_date}`
  var db = fs.readFileSync(dbPath);
  var currentDb = JSON.parse(db)
  var obj = {id,...req.body,addedAt}
  var newDb = [...currentDb,obj]
  var dbJson = JSON.stringify(newDb,null,2)
  fs.writeFileSync(dbPath,dbJson);
  res.status(201).json(newDb);
});

app.put('/:id', (req, res) => {
  var db = fs.readFileSync(dbPath);
  var currentDb = JSON.parse(db)
  var index = currentDb.findIndex(i => {
    return i.id === req.params.id
  })
  
  currentDb[index] = {...req.body}
  var dbJson = JSON.stringify(currentDb,null,2)
  fs.writeFileSync(dbPath,dbJson);

  res.status(201).json(currentDb);

});

app.delete('/:id', (req, res) => {
  var db = fs.readFileSync(dbPath);
  var currentDb = JSON.parse(db)
  var newDb = currentDb.filter(i => {
    return i.id != req.params.id
  })

  var dbJson = JSON.stringify(newDb,null,2)
  fs.writeFileSync(dbPath,dbJson);
  res.status(201).json(newDb);
});


module.exports = app;
