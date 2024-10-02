import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import dotenv from "dotenv";
import { dirname } from "path";
import express from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";

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

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function createTransporter(){
  try
  {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      service: "gmail",
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    return transporter;
  }
  catch(error){
    console.error(error);
  }
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
      const transporter = await createTransporter();
      if (!transporter) {
        throw new Error("Failed to create transporter");
      }
      
      // Takes user data and creates a mailOptions object for nodemailer
      const { name, email, phone, message } = req.body;

      const mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: "New Message from PsychoStudios.com",
        contactInfo: req.body.phone + " " + req.body.name,
        text: req.body.message,
      };

      // logic that handles transportation and errors
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          log(error);
          res.redirect("/failure");
        } else {
          console.log("Email sent: " + info.response);
          res.redirect("/success");
        }
      });
      log("user data:", req.body);
    } catch (error) {
      console.error(error);
      res.redirect("/failure");
    }
  }
);
