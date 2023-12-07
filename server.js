import express from "express";
import https from "https";

// Create a service (the app object is just a callback).
const app = express();

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(443);

import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const log = console.log;
const path = dirname(fileURLToPath(import.meta.url));
const port = 443;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get( "/" , async (req, res) => {
    try
    {
       const result = await app.get(path + "/public/index.html");
       res.render("index.html", {content: "APIResponse"});
    }
    catch(Error e)
    {
        res.status(404).send();
    }
});

app.post("/email", (req, res) => {
    log('data:', req.body);
    res.sendFile(path , "/public/index.html");
  });

app.listen(port, () => {
    log("server running successfully on port 443 dragon");
});
