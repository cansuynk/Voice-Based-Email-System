const express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
const app = express()
const port = 8080
const {sign_in, login, logout, fetch_user, delete_user} = require("./src/auth.js")
const {fetch_emails, send_email} = require("./src/email.js")


app.use(bodyParser.json()); 
app.use(session({secret: '5813213455karubusnac',saveUninitialized: true,resave: true}));

app.post('/api/auth/sign_in', sign_in); //send(JSON)  username, password, address 
app.post('/api/auth/login', login);     //send(JSON)  password, address 
app.get('/api/auth/logout', logout);    // null
app.get('/api/auth/fetch_user', fetch_user); //null
app.get('/api/auth/delete_user', delete_user); //null
app.post('/api/email/send_email', send_email); //send(JSON) subject, to, content
app.get('/api/email/fetch_emails', fetch_emails); //null


app.listen(port, () => console.log(`A listening on port ${port}!`))