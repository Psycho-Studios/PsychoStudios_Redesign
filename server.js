var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');


// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
http.createServer(app).listen(80);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const log = console.log;
const path = dirname(fileURLToPath(import.meta.url));
const port = 80;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get( "/" , (req, res) => {
    res.sendFile( path , + "index.html")
});

app.post("/email", (req, res) => {
    log('data:', req.body);
    res.sendFile(path , "/public/index.html");
  });

app.listen(port, () => {
    log("server running successfully on port 80 dragon");
});
