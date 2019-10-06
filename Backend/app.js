const express = require('express')
var session = require('express-session');
var bodyParser = require('body-parser');
const app = express()
const port = 3000
const {sign_in, login, logout} = require("./routes/auth.js")


app.use(bodyParser.json()); 
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

app.post('/api/auth/sign_in', sign_in);
app.post('/api/auth/login', login);
app.get('/api/auth/logout', logout);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))