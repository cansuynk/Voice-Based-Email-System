// Step 1: Include required modules
var Imap = require('imap'),
inspect = require('util').inspect; 
const Gmail = require('gmail-send');
const simpleParser = require('mailparser').simpleParser;
const {SUCCESS, NOT_AUTH, UNEXPECTED} = require("./error_codes.js");


//Fetch emails from folder indicated at req.body["search"] (either "SENT" or "INBOX")
exports.fetch_emails = function(req, response) {
    if (req.session.address) {
        get_emails(new Imap({
            user: req.session.address,
            password: req.session.password, 
            host: 'imap.gmail.com', 
            port: 993,
            tlsOptions: {
            rejectUnauthorized: false
            },
            tls: true
        }), req.body["search"], (emails) => {
            //Success Response
            response.send( {
                code: SUCCESS,
                detail: "Success",
                data: emails
            })
        })
    } else {
        //Session is null so user is not authenticated yet
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

//Send email using gmail-send package
exports.send_email = function(req, response) {
    if (req.session.address) {
        //Extract necessary information from request body
        const body = req.body;
        const subject = body["subject"];
        const to = body["to"];
        const content = body["content"]
        write_email({
            //Exctract credentials from the session
            user: req.session.address,
            pass: req.session.password,
            to:   to,
            subject: subject
        }, content, (err, res) => {
            if (err) {
                //Fails if user supplied wrong password on sign in
                response.send({
                    code: UNEXPECTED,
                    detail: err,
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
        //Session is null so user is not authenticated yet
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}


//Local function used by send_email
function write_email(options, content, callback) {
    const send = Gmail(options)
    send({text: content, }, (error, result, fullResult) => {
        if (error) {
            callback(error, null);
        } 
        else {
            callback(null, result);
        }
    })
}

//Local helper for fetch_emails functions
function get_emails(imap, search_str,callback) {
    var emails = []
    function openBox(cb) {
        //Open the requested box (email folder "Sent emails" or "Inbox")
        imap.getBoxes((err, boxes) => {
            console.log(boxes);
            if (search_str === "SENT") {
                var objs = boxes["[Gmail]"].children
                //API is language dependend so sent emails box cannot be address directly as "Sent Mails"
                //For example, Turkish users have "Gönderilmiş Postalar" folder
                //So iterate over all boxes to find the correct one by checking attributes
                for (let key of Object.keys(objs)) {
                    if (objs[key].attribs[1] === "\\Sent") {
                        console.log("[Gmail]/" + key.trim(), ":",objs[key].attribs[1])
                        imap.openBox("[Gmail]/" + key.trim(), true, cb);
                    }
    
                }
            } else {
                imap.openBox("INBOX", true, cb);
            }
        })
        
    }
      
    imap.once('ready', function() {
    openBox(function(err, box) {
    if (err) throw err;

    //Get ALL emails in the box
    imap.search(['ALL'], function(err, results) { 
        if (err) throw err;

        var f = imap.fetch(results, { bodies: '' });
        f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno); 
        var prefix = '(#' + seqno + ') ';

        //Logic of handling data stream 
        msg.on('body', function(stream, info) {
            console.log(prefix + 'Body');
            const chunks = [];
            //Push received chunks to an array
            stream.on("data", function (chunk) {
                chunks.push(chunk);
            });

            stream.on("end", function () {
                //On End, concat the chunks, convert to string and parse using simpleParser
                simpleParser(Buffer.concat(chunks).toString(), (err, mail) => {
                    var target, subject, content;
                    //Inbox and Sent mails parsed differently
                    if (search_str === "INBOX") {
                        target = mail.from.text;
                        subject = mail.subject;
                        content = mail.text;
                    } else {
                        target = mail.to.text;
                        subject = mail.subject;
                        content = mail.text;
                    }
                    //Push parsed emails to the array 
                    emails.push({
                        target: target,
                        subject: subject,
                        content: content
                    })
                })
            });
        });

        msg.once('attributes', function(attrs) {
            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
            console.log(prefix + 'Finished');
        });
        });
        f.once('error', function(err) {
        console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
        });
    });
    });
    });
    
    imap.once('error', function(err) {
    console.log(err);
    });
    
    imap.once('end', function() {
        console.log('Connection ended');
        callback(emails)
    });
    
    imap.connect(); 
}
