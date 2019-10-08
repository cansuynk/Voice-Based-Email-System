// Step 1: Include required modules
var Imap = require('imap'),
inspect = require('util').inspect; 
const Gmail = require('gmail-send');
const {SUCCESS, NOT_AUTH, UNEXPECTED} = require("./error_codes.js");


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
            response.send( {
                code: SUCCESS,
                detail: "Success",
                data: emails
            })
        })
    } else {
        response.send({
            code: NOT_AUTH,
            detail: "user not authenticated",
            data: null
        })
    }
}

exports.send_email = function(req, response) {
    if (req.session.address) {
        const body = req.body;
        const subject = body["subject"];
        const to = body["to"];
        const content = body["content"]
        write_email({
            user: req.session.address,
            pass: req.session.password,
            to:   to,
            subject: subject
        }, content, (err, res) => {
            if (err) {
                response.send({
                    code: UNEXPECTED,
                    detail: err,
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

function get_emails(imap, search_str,callback) {
    var emails = []
    function openInbox(cb) {
        imap.openBox(search_str, true, cb);
    }
      
    imap.once('ready', function() {
    openInbox(function(err, box) {
    if (err) throw err;

    imap.search(['ALL'], function(err, results) { 
        if (err) throw err;

        var f = imap.fetch(results, { bodies: '' });
        f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno); 
        var prefix = '(#' + seqno + ') ';

        msg.on('body', function(stream, info) {
            console.log(prefix + 'Body');
            const chunks = [];
            stream.on("data", function (chunk) {
                chunks.push(chunk);
            });

            stream.on("end", function () {
                var mail = Buffer.concat(chunks).toString()
                mail = mail.substring(mail.indexOf('From: '))
                const from = mail.substring(mail.indexOf('<') + 1, mail.indexOf('>'));
                const subject = mail.substring(mail.indexOf('Subject:') + 9, mail.indexOf('To:') - 2);
                const content = mail.substring(mail.indexOf('text/plain') + 31 , mail.indexOf('text/html') - 50);
                emails.push({
                    from: from,
                    subject: subject,
                    content: content
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
