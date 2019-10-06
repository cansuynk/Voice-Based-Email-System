const Gmail = require('gmail-send')

function send_email(options, content,) {
    const send = Gmail(options)
    send({text: content, }, (error, result, fullResult) => {
        if (error) 
          console.error(error);
        console.log(result);
    })
}


send_email({
    user: 'mail.system.test123@gmail.com',
    pass: 'mail_test',
    to:   'mustafaburakgurbuz@gmail.com',
    subject: 'Subject sadasd',
}, "hadi insallah")