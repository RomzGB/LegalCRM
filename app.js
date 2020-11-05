require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
require('./passport-setup')
const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPW}@lawcrm.gmymo.mongodb.net/LawCRM?retryWrites=true&w=majority`
const ClientModel = require('./models/client-model').ClientModel
const bodyParser = require("body-parser");
const path = require('path');
dirName = __dirname
console.log(process.env)

const clients = require('./routes/clientRoutes')
const contracts = require('./routes/contractRoutes')
const assignments = require('./routes/assignmentRoutes')
const functions = require('./routes/functionRoutes')
//const calendarAPI = require('./functions/calendarAPI')
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("connected")},
    err =>{
        console.log(err)
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
    name: 'law-CRM',
    keys: ['key1', 'key2']
}))


app.use(passport.initialize())
app.use(passport.session())



app.use('/clients', clients)
app.use('/contracts', contracts)
app.use('/assignments', assignments)
app.use('/functions', functions)
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/success', (req, res)=>{
    if(req.user._json.email === "romzgb1@gmail.com" || req.user._json.email === "boazshalev@gmail.com")
    res.sendFile(path.join(__dirname + '/CRMfront.html'));
    else{
        res.sendFile(path.join(__dirname + '/index.html'));
    }
})
app.get("/google", passport.authenticate('google', {scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly',]}), (req, res)=>{})


app.get('/google/callback', passport.authenticate('google', {failureRedirect: '/failed'}), (req,res)=>{
    res.redirect('/success')
})

app.listen(process.env.PORT, ()=>{
    console.log(`App running on port ${process.env.PORT}!`)
})

