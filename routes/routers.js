import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import dotenv from "dotenv";
import { dirname } from "path";
import express from "express";
import nodemailer from "nodemailer";

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
process.env.port = "443"; //Production value, use '0' when in lower environment (lol this is technically Github, a "side" environment)

export const router = express.Router(); // router functNions created and exported

const transporter = nodemailer.createTransport({
  host: "target",
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Routes that handle the different views of the website
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      log(errors, "One or more fields are not correctly filled");
      return res.redirect("/failure");
    }

    try {
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
      log.error(error);
      res.redirect("/failure");
    }
  }
);
