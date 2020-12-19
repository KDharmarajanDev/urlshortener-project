require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require("body-parser");

var urls = {};
var last_id = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/new', function(req, res){
  dns.lookup(req.body.url, function(err){
    if (err == null){
      last_id += 1;
      urls[last_id] = req.body.url;
      res.json({original_url: req.body.url, short_url: last_id});
    } else {
      res.json({error: 'invalid url'});
    }
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
