import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;


app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get( "/" , (req, res) => {
    res.render("public/index.html")
});



app.listen(port, () => {
    console.log("server running successfully on port 3000 dragon");
});
