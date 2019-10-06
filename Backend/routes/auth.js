const {createHash} = require('crypto');
const {pool} = require("./db.js")
const {UNEXPECTED, SUCCESS, NOT_FOUND} = require("./error_codes.js")

function computeSHA256(str) {
  const hash = createHash('sha256');
  hash.write(str)
  return hash.digest('hex');
}


exports.sign_in = function(req, respond) {
    const body = req.body;
    //fetch data from json
    const email = body["email"];
    const username = body["username"];
    const password = body["password"];
    const hash = computeSHA256(password);
    
    //Try to insert
    pool.query("INSERT INTO users VALUES ($1, $2, $3)", [email, username, hash], (err, res) => {
        if (err) {
            console.log(err)
            respond.send({
                code: err.code,
                detail: err.detail
            })
        } else {
            //Set cookie
            sess=req.session;
            sess.email = email;
            sess.password = password;
            sess.username = username;
            respond.send({
                code: SUCCESS,
                detail: "Success"
            })
        }
    })   
}

exports.login = function(req, respond) {
    const body = req.body;
    const password = body["password"];
    const email = body["email"];
    const hash = computeSHA256(password);

    pool.query("SELECT username FROM users WHERE hash = $1 AND address = $2", [hash, email], (err, res) => {
        if (err) {
            console.log(err)
            respond.send({
                code: err.code,
                detail: err.detail
            })
        } else {
            if (res.rows.length === 0){
                respond.send({
                    code: NOT_FOUND,
                    detail: "Email address or the password is invalid"
                })
            } else {
                //Set cookie
                sess=req.session;
                sess.email = email;
                sess.password = password;
                sess.username = res.rows[0]["username"];
                respond.send({
                    code: SUCCESS,
                    detail: "Success"
                })
            }
        }
    })
}

exports.logout = function(req, respond) {
    req.session.destroy(err => {
        if(err) {
            respond.send({
                code: UNEXPECTED,
                detail: "Unexpected Error"
            })
        } else {
            respond.send({
                code: SUCCESS,
                detail: "Success"
            })
        }
    })
}