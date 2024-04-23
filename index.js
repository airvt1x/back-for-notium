import express from "express";
import mongoose from "mongoose";


import {checkAuth, handleValidationErrors} from "./utils/index.js";
import { UserController } from "./controllers/index.js";

mongoose.set("strictQuery", false);

mongoose
    .connect('mongodb+srv://airvt1x:airvt1xairvt1x@clasteric.adybi34.mongodb.net/notium?retryWrites=true&w=majority&appName=clasteric')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();
app.use(express.json());
app.listen(1234, (err)=>{
    if (err) {
        return console.log(err);
    }

    console.log('Server OK ');
});

app.get('/', (req,res) => {
    res.send('Гугуца батрачит')
});
app.post('/auth/login', handleValidationErrors, UserController.login);
app.post('/auth/register', handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
