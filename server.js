import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/routers.js";

const app = express();
const log = console.log;
const path = dirname(fileURLToPath(import.meta.url));
const port = 3000;
// change port to 443 in production to enable https connection

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
  log("server running successfully on port 3000 sir !");
});
