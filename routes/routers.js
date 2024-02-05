import express from 'express'; 
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator';
import { dirname } from 'path'; 
import { fileURLToPath } from 'url';
export const router = express.Router(); // router functions created and exported



const app = express();
const log = console.log; 
const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded


router.get( "/" , (req, res,) => {
    res.sendFile( path , + "index.html");
});


router.post( path + '/email', 
    [
      check('name', 'Name is required').not().isEmpty(), 
      check('email', 'Email is required').isEmail(),
      check('phone', 'Phone is required').not().isEmpty(),
      check('message', 'Message is required').not().isEmpty()
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const { name , email , phone , message } = req.body;
        console.log('data:', req.body);
        res.send('Information received')
      } catch (error) {
        console.error(error);
        res.status(500).send('An error has occurred');
      }
    }
  );
