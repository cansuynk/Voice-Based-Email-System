const express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
const app = express()
const port = 3000
const {sign_in, login, logout, fetch_user, delete_user} = require("./src/auth.js")
const {fetch_emails, send_email} = require("./src/email.js")


app.use(bodyParser.json()); 
app.use(session({secret: '5813213455karubusnac',saveUninitialized: true,resave: true}));

app.post('/api/auth/sign_in', sign_in);
app.post('/api/auth/login', login);
app.get('/api/auth/logout', logout);
app.get('/api/auth/fetch_user', fetch_user);
app.get('/api/auth/delete_user', delete_user);
app.post('/api/email/send_email', send_email);
app.get('/api/email/fetch_emails', fetch_emails);

app.listen(port, () => console.log(`A listening on port ${port}!`))