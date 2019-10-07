const {createHash} = require('crypto');
const {pool} = require("./db.js")
const {UNEXPECTED, SUCCESS, NOT_FOUND, NOT_AUTH} = require("./error_codes.js")

function computeSHA256(str) {
  const hash = createHash('sha256');
  hash.write(str)
  return hash.digest('hex');
}


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
            response.send({
                code: SUCCESS,
                detail: "Success",
                data: null
            })
        }
    })   
}

exports.login = function(req, response) {
    const body = req.body;
    const password = body["password"];
    const address = body["address"];
    const hash = computeSHA256(password);

    pool.query("SELECT username FROM users WHERE hash = $1 AND address = $2", [hash, address], (err, res) => {
        if (err) {
            console.log(err)
            response.send({
                code: err.code,
                detail: err.detail,
                data: null
            })
        } else {
            if (res.rows.length === 0){
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
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })
            }
        }
    })
}

exports.fetch_user = function(req, response) {
    if(req.session.address) {
        const sess =  req.session;
        response.send({
            code: SUCCESS,
            detail: "Success",
            data: {
                username: sess.username,
                address: sess.address
            }
        })
    } else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

exports.delete_user = function(req, response) {
    if(req.session.address) {
        const sess =  req.session;
        pool.query("DELETE FROM users WHERE address = $1", [sess.address], (err, res) => {
            if (err) {
                console.log(err)
                response.send({
                    code: err.code,
                    detail: err.detail,
                    data: null
                })
            } else {
                response.send({
                    code: SUCCESS,
                    detail: "Success",
                    data: null
                })
            }
        })
    } else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

exports.logout = function(req, response) {
    req.session.destroy(err => {
        if(err) {
            response.send({
                code: UNEXPECTED,
                detail: "Unexpected Error",
                data: null
            })
        } else {
            response.send({
                code: SUCCESS,
                detail: "Success",
                data: null
            })
        }
    })
}