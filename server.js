import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/routers.js";
import { google } from "googleapis";

const app = express();
const log = console.log;
const path = dirname(fileURLToPath(import.meta.url));
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Route to handle OAuth2 callback
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      return res.status(400).send('Error retrieving access token');
    }
    oAuth2Client.setCredentials(token);
    res.send('Authentication successful! You can close this window.');
    // Save the token to your environment variables or a secure storage
  });
});

app.listen(port, () => {
  log("server running successfully on port 3000 sir !");
});
