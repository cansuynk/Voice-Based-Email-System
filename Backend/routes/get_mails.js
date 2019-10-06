// Step 1: Include required modules
var Imap = require('imap'),
    inspect = require('util').inspect; 
    var fs = require('fs'), fileStream; 


function fetch_emails(imap, callback) {
    var emails = []
    function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
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

var imap = new Imap({
    user: 'mail.system.test123@gmail.com',
    password: 'mail_test', 
    host: 'imap.gmail.com', 
    port: 993,
    tlsOptions: {
      rejectUnauthorized: false
      },
    tls: true
  });

  
fetch_emails(imap, function(emails) {
    for(var i = 0; i < emails.length; i++ ){
        console.log(emails[i])
    }
})


