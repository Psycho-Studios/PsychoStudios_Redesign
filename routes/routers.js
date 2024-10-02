import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import dotenv from "dotenv";
import { dirname } from "path";
import express from "express";
import { google } from "googleapis";
import {readline } from "readline";

import { fileURLToPath } from "url";
import path from "path";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const log = console.log;
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
dotenv.config(); // to use the .env file
const PORT = process.env.PORT || 3000; // port number
export const router = express.Router(); // router functions created and exported

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");

  var encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}

// Routes that handle the different views of the website
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/privacypolicy", (req, res) =>{
  res.sendFile(path.join(__dirname, "../views/privacypolicy.html"));
});

router.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/failure.html"));
});

router.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/success.html"));
});

router.post(
  "/email",
  // an array that checks if the fields are empty or not and returns an error message if they are
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("phone", "Phone number is required").not().isEmpty(),
    check("message", "Message is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors =  await validationResult(req);
    if (!errors.isEmpty()) {
      log(errors, "One or more fields are not correctly filled");
      return res.redirect("/failure");
    }

   try {      
      // Takes user data and creates a mailOptions object for nodemailer
      const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'https://www.psychostudios.net/oauth2callback');
      oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send'],
      });

      console.log('Authorize this app by visiting this url:', authUrl);

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            return console.error('Error retrieving access token', err);
          }
          oAuth2Client.setCredentials(token);
          console.log('Access Token:', token.access_token);
          console.log('Refresh Token:', token.refresh_token);
          // Save the token to your environment variables or a secure storage
        });

      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      let rawBody = makeBody(
        process.env.EMAIL, //Receiver
        req.body.email, //Sender
        "New Message via PsychoStudios.com from: " + req.body.name + " with phone number: " + req.body.phone, //Subject
        req.body.message // Message
      );
      const response = await gmail.users.messages.send({
        userId: 'me',
        resource: { rawBody },
      });
      if (response.error) {
        log(response.error);
        res.redirect("/failure");
      } 
      else {
        console.log("Email sent: " + info.response);
        res.redirect("/success");
      }
      // logic that handles transportation and errors
    } 
    catch (error) {
      console.error(error);
      res.redirect("/failure");
    }
  }
);
