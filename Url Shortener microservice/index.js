require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

const URLSchema = new mongoose.Schema({
  original_url: { type: String, required: true, unique: true },
  short_url: { type: String, required: true, unique: true }
});

let URLModel = mongoose.model("url", URLSchema);

// Middleware to parse post requests
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:short_url', function(req, res) {
  let short_url = req.params.short_url;
  URLModel.findOne({ short_url: short_url }).then((foundUrl) => {
    if (foundUrl) {
      let original_url = foundUrl.original_url;
      res.redirect(original_url);
      return;
    }
    else {
      res.json({ "error": "invalid Url" });
    }
  })

})
// Your first API endpoint
app.post('/api/shorturl', function(req, res) {

  let url = req.body.url;
  try {
    // Check if the url is valid...
    urlObj = new URL(url);
    dns.lookup(urlObj.hostname, (err, address, family) => {
      // if no addresses returned -> invalid url...
      if (!address) {
        res.json({ error: 'invalid url' });
      }
      // if url is valid...
      else {
        let original_url = urlObj.href;

        // Check if url exists in the database...
        URLModel.findOne({ original_url: original_url }).then((foundUrl) => {
          // if match found...
          if (foundUrl) {
            res.json({
              original_url: original_url,
              short_url: foundUrl.short_url
            })
          }
          // if match not found create a new entry...
          else {
            // create an new short url...
            URLModel.find({}).sort({ short_url: "desc" }).limit(1).then((lastUrl) => {
              let short_url = 1;
              if (lastUrl.length > 0) {
                short_url = String(parseInt(lastUrl[0].short_url) + 1);
              }
              let newUrl = new URLModel({
                original_url: original_url,
                short_url: short_url
              })
              newUrl.save();
              res.json({
                original_url: original_url,
                short_url: short_url
              });
            })
          }
        })
      }
    })
  } catch {
    res.json({ error: 'invalid url' })
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
