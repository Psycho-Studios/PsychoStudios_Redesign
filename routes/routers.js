import express from 'express'; 
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';
import  path  from 'path';
import { dirname } from 'path'; 
import { fileURLToPath } from 'url';
export const router = express.Router(); // router functions created and exported



const app = express();
const log = console.log; 
const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded


router.get( "/" , (req, res,) => {
    res.sendFile( path.join(__dirname , "../views/index.html"));
});

router.get( "/failure" , (req, res) => {
    res.sendFile( path.join(__dirname , "../views/failure.html"));
});

router.get( "/success" , (req, res) => {
    res.sendFile( path.join(__dirname , "../views/success.html"));
});

router.post( "/email", 

        [
          check('name', 'Name is required').not().isEmpty(), 
          check('email', 'Email is required').isEmail(),
          check('phone', 'Phone is required').not().isEmpty(),
          check('message', 'Message is required').not().isEmpty()
        ] , 
        async (req, res) => {

    
      try {
        const { name , email , phone , message } = req.body;
        console.log('user data:', req.body);
        res.redirect('/success');
      } catch (error) {
        console.error(error);
        res.status(500).send('An error has occurred');
      }
    });
