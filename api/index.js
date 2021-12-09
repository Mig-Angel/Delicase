var http = require('http') , https = require('https');
const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.json());



app.use(require('./routes/general'));

app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}.`);
});
