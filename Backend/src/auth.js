const {createHash} = require('crypto');
const {pool} = require("./db.js")
const {UNEXPECTED, SUCCESS, NOT_FOUND, NOT_AUTH} = require("./error_codes.js")


//SHA256 function for hashing passwords
function computeSHA256(str) {
  const hash = createHash('sha256');
  hash.write(str)
  return hash.digest('hex');
}


//Sign in function to create new account
exports.sign_in = function(req, response) {
    const body = req.body;
    //fetch data from json
    const address = body["address"];
    const username = body["username"];
    const password = body["password"];
    const hash = computeSHA256(password);
    
    //Try to insert
    pool.query("INSERT INTO users VALUES ($1, $2, $3)", [address, username, hash], (err, res) => {
        if (err) {
            console.log(err)
            //Error response, due to uniqueness violation
            response.send({
                code: err.code,
                detail: err.detail,
                data: null
            })
        } else {
            //Set cookie
            sess=req.session;
            sess.address = address;
            sess.password = password;
            sess.username = username;
            //Success Response
            response.send({
                code: SUCCESS,
                detail: "Success",
                data: null
            })
        }
    })   
}

//Login function to check credentials and configure sessions accordingly
exports.login = function(req, response) {
    const body = req.body;
    //fetch data from json
    const password = body["password"];
    const address = body["address"];
    const hash = computeSHA256(password);
    //Execute a select querry
    pool.query("SELECT username FROM users WHERE hash = $1 AND address = $2", [hash, address], (err, res) => {
        if (err) {
            //Error due to database, e.g. connection failure
            console.log(err)
            response.send({
                code: err.code,
                detail: err.detail,
                data: null
            })
        } else {
            if (res.rows.length === 0){
                //Could not matched any account 
                response.send({
                    code: NOT_FOUND,
                    detail: "Email address or the password is invalid",
                    data: null
                })
            } else {
                //Set cookie
                sess=req.session;
                sess.address = address;
                sess.password = password;
                sess.username = res.rows[0]["username"];
                //Success Response
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })
            }
        }
    })
}


//Function to check if user authenticated
exports.fetch_user = function(req, response) {
    if(req.session.address) {
        const sess =  req.session;
        //Session is valid return success response
        response.send({
            code: SUCCESS,
            detail: "Success",
            data: {
                username: sess.username,
                address: sess.address
            }
        })
    } else {
        //Session is null, user not logged in yet
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

//Delete the request senders account
exports.delete_user = function(req, response) {
    if(req.session.address) {
        const sess =  req.session;
        //Run delete command
        pool.query("DELETE FROM users WHERE address = $1", [sess.address], (err, res) => {
            if (err) {
                //Database related error occured, it is unexpected
                console.log(err)
                response.send({
                    code: err.code,
                    detail: err.detail,
                    data: null
                })
            } else {
                //Success response
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })
            }
        })
    } else {
        //Could not get the session, user is not logged in.
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

//Function to destroy session so that the user can log out
exports.logout = function(req, response) {
    req.session.destroy(err => {
        if(err) {
            //This is unexpexted error, session destroy should work if session exists
            //It may fail if a somehow sent a logout request without logging in.
            response.send({
                code: UNEXPECTED,
                detail: "Unexpected Error",
                data: null
            })
        } else {
            //Success Response
            response.send({
                code: SUCCESS,
                detail: "Success",
                data: null
            })
        }
    })
}