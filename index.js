import express from "express";
import mongoose from "mongoose";
import cors from 'cors';


import {checkAuth, handleValidationErrors} from "./utils/index.js";
import { UserController } from "./controllers/index.js";

mongoose.set("strictQuery", false);

mongoose
    .connect('mongodb+srv://airvt1x:airvt1xairvt1x@clasteric.adybi34.mongodb.net/notium?retryWrites=true&w=majority&appName=clasteric')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();
app.use(express.json());
const allowedOrigins = [
    'https://notium-app.vercel.app/'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', 'https://notium-app.vercel.app/')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }
    return await fn(req, res)
  }
  
  
  
app.listen(1234, (err)=>{
    if (err) {
        return console.log(err);
    }

    console.log('Server OK ');
});

app.get('/', (req,res) => {
    res.send('Гугуца батрачит')
});
app.post('/auth/login', handleValidationErrors, allowCors(UserController.login));
app.post('/auth/register', handleValidationErrors, allowCors(UserController.register));
app.get('/auth/me', checkAuth,allowCors(UserController.getMe));
