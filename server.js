import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import jQuery from 'jquery';

const app = express();
const log = console.log;
const path = dirname(fileURLToPath(import.meta.url));
const port = 3000;


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get( "/" , (req, res,) => {
    res.sendFile( path , + "index.html")
});


app.post("/email", (req, res) => {
    log('data:', req.body);
    res.render(path , "/public/index.html");
  });


app.listen(port, () => {
    log("server running successfully on port 3000 dragon");
});
