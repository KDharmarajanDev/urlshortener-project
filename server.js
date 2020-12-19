require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const urlExist = require('url-exist');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Basic Configuration
const port = process.env.PORT || 3000;

last_id = 0
urls = {}

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
  (async () => {
    const exists = await urlExist(req.body.url);
    if (exists){
      last_id += 1;
      urls[last_id] = req.body.url;
      res.json({original_url: req.body.url, short_url: last_id});
    } else {
      res.json({error: 'invalid url'});
    }
  })();
});

app.get('/api/shorturl/:short_url?', function(req, res){
  if (req.params.short_url in urls){
    res.status(301).redirect(urls[parseInt(req.params.short_url)]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
