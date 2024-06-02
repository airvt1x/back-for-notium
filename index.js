import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";


import {checkAuth, handleValidationErrors} from "./utils/index.js";
import { UserController, NoteController } from "./controllers/index.js";
import User from "./models/User.js";

mongoose.set("strictQuery", false);

dotenv.config();
const MONGO_DB = process.env.MONGO_DB;

mongoose
    .connect(MONGO_DB)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();
app.use(express.json());
var access_token = '';

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
//notes
app.get('/notes', checkAuth, NoteController.getNotes);
app.get('/notes/:id', checkAuth, NoteController.getOne);
app.post('/notes', checkAuth, handleValidationErrors, NoteController.create);
app.delete('/notes/:id', checkAuth, NoteController.remove);
app.patch('/notes/:id', checkAuth, handleValidationErrors, NoteController.update);
app.get('/fav_notes', checkAuth, NoteController.getfavoriteNotes);
//github
app.get('/github', (req,res)=>{
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`,)
});
app.post('/gitlogin', UserController.gitlogin)

app.get('/oauth-callback', (req, res) => {

    // The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code
    
    axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${requestToken}`,
      // Set the content type header, so that we get the response in JSON
      headers: {
           accept: 'application/json'
      }
    }).then((response) => {
        access_token = response.data.access_token
        res.redirect('https://back-for-notium.vercel.app/success');
      })
    })
    
    app.get('/success', function(req, res) {
        var pochta = '';
        axios({
            method: 'get',
            url: 'https://api.github.com/user',
            headers: {
                Authorization: 'token ' + access_token
            }
        }).then((response) => {
            const requestBody = {
                email: response.data.email
            };
    
            // Log the request body
            console.log('Request body being sent to /gitlogin:', requestBody);
    
            axios({
                method: 'post',
                url: 'https://back-for-notium.vercel.app/gitlogin',
                data: requestBody
            }).then((response) => {
                res.json(response.data);
            }).catch((error) => {
                console.error('Error during /gitlogin request:', error);
                res.status(500).send('Error during /gitlogin request');
            });
        }).catch((error) => {
            console.error('Error during GitHub user request:', error);
            res.status(500).send('Error during GitHub user request');
        });
    });