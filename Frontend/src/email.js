// eslint-disable-no-redeclare
import React from 'react';
import './email.css';
import Axios from 'axios';
import { SUCCESS } from './error_codes.js';
import Speech2Text from "./s2t.js";
import Spell2Text from "./spell2text.js"

var synth = window.speechSynthesis
var allText = []
var sendingInfo = []
class Email extends React.Component {
    constructor() {
        super();
        this.inboxFunction = this.inboxFunction.bind(this); //for listing mails that are received.
        this.sentFunction = this.sentFunction.bind(this);   //for listing mails that are sent.
        this.mailContent = this.mailContent.bind(this);     //for displaying the content of the selected mail
        this.sendMail = this.sendMail.bind(this);           //forum for send a mail
        this.handleSendSubmit = this.handleSendSubmit.bind(this);   //For handling inputs to send a mail
        this.handleChange = this.handleChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleStart = this.handleStart.bind(this);
        this.get_emails = this.get_emails.bind(this);
        this.get_emails_sent = this.get_emails_sent.bind(this);

        this.state = {

            InboxMails: [],
            SentMails: [],
            //initial mails list div 
            mailsContent: <tr ><td colSpan="2" id="noselected_div">   
                No Folder selected.
            </td></tr>,

            //initial mail body div 
            mailBody: <div className="noselected_div">
                No Mail selected.
            </div>,

            mail_list_header1: "",  //Mails list table header can be changed according to sent or received mail (To/From)
            mail_list_header2: "",  //Holds "Subject" header

            email_to_send: "",  //this states are for saving sending mail info
            subject_to_send: "",
            message_to_send: "",

            utterText: " To Send Email, please say Send Email. To Listen Email, say Listen. and To Exit, say Logout",
            initial: true,
            sendEmail: false,
            inboxEmail: false,
            sentEmail: false,

        };
}

    text2speech = (text) => {
        synth.cancel()
        var utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    }

    componentDidMount() {
        this.get_emails();
        this.get_emails_sent();
        document.addEventListener('keypress', this.handleClick)
    }

    componentWillUnmount() {
        synth.cancel()
        document.removeEventListener('keypress', this.handleClick)
    }


    get_emails() {
        Axios.post("/email/fetch_emails", {"search": "INBOX"}).then((req) => {
            if (req.data.code === SUCCESS){
                this.setState({
                    InboxMails: req.data.data
                })
            }
        })
    }

    
    get_emails_sent() {
        Axios.post("/email/fetch_emails", {"search": "SENT"}).then((req) => {
            if (req.data.code === SUCCESS){
                this.setState({
                    SentMails: req.data.data
                })
            }
        })
    }
    
    inboxFunction() {
        //This function is for listing mails that are received.
        const list = this.state.InboxMails.map((item, index) => 
     
            <tr key={index} onClick={() => this.mailContent(item, 0)}>
                <td>{item.target}</td>
                <td>{item.subject}</td>
            </tr>
            
        );
        
        this.setState({
            mailsContent: list,
            mail_list_header1: "From",
            mail_list_header2: "Subject"
        });

    }

    sentFunction() {

        //This function is for listing mails that are sent.

        const list = this.state.SentMails.map((item, index) =>

            <tr key={index} onClick={() => this.mailContent(item, 1)}>
                <td>{item.target}</td>
                <td>{item.subject}</td>
            </tr>

        );

        this.setState({
            mailsContent: list,
            mail_list_header1: "To",
           mail_list_header2: "Subject"
        });

    }

    mailContent(item, id) {
        //This function is for displaying the content of the selected mail

        var from_to = "From: "  //If a received mail is wanted to display, it changes the header of the table
        var address = item.target
        if (id === 1) {
            from_to = "To: "    //If a sent mail is wanted to display
            address = item.target
        }
            
        const content =
            <div className="mailbody_div">
                <table>
                    <tbody>
                    <tr>
                        <td><h5>{from_to} </h5></td>
                        <td> <h6>{address}</h6></td>
                    </tr>

                    <tr>
                        <td><h5>Subject:  </h5></td>
                        <td> <h6>{item.subject}</h6></td>
                    </tr> 
                    </tbody>
                </table>

                <hr size="10"/>
                <p>  {item.content}</p>
            </div>

        this.setState({
            mailBody: content
        });

    }

    sendMail() {

        //This function changes the mail content div to be able to send a mail, it gives a form: "mail to send", "subject to send" and "message to send"

        this.setState({
            mailBody: 
       <form className="form-horizontal" action="#forms" onSubmit={this.handleSendSubmit}>
            <div className="form-group">
            <div className="col-3 col-sm-12">
                <label className="form-label" htmlFor="input-example-4"><h5>To: </h5></label>
            </div>
            <div className="col-9 col-sm-12">
                            <input className="form-input" id="address"
                                type="email"
                                placeholder="Email"
                                name="email_to_send"
                                onChange={this.handleChange}
                            />
            </div>
            </div>
            <div className="form-group">
            <div className="col-3 col-sm-12">
                <label className="form-label" htmlFor="input-example-5"><h5>Subject: </h5></label>
            </div>
            <div className="col-9 col-sm-12">
                            <input className="form-input" id="subject"
                                type="subject"
                                placeholder="Subject"
                                name="subject_to_send"
                                onChange={this.handleChange}/>
            </div>
            </div>
            
            <div className="form-group">
            <div className="col-3 col-sm-12">
                <label className="form-label" htmlFor="input-example-6"><h5>Message: </h5></label>
            </div>
            <div className="col-9 col-sm-12">
                            <textarea className="form-input" id="message"
                                placeholder="Textarea"
                                rows="3"
                                name="message_to_send"
                                onChange={this.handleChange}></textarea>
            </div>
            </div>

             <div className="form-group">
                <div className="btn-group btn-group-block">
                    <button className="btn btn-lg" id= "sendemail_button" type="submit">Send Email</button>
                </div>
            </div>
            
        </form>

        });

        
    }
    handleLogout(e){
        if (e) {
            e.preventDefault();
        }
        Axios.get("/auth/logout").then((req) => {
            if (req.data.code !== SUCCESS) {
                alert(req.data.detail)
            }
            this.text2speech("Log out succesfull")
            
        })
        this.props.ask_auth();
    }
    //For handling inputs(mail to send, subject and message) from sending mail menu
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
   
    }

    handleSendSubmit(e) {
        if (e) {
            e.preventDefault()
        }
        Axios.post("/email/send_email", {"subject": this.state.subject_to_send,
          "to": this.state.email_to_send, "content": this.state.message_to_send}).then((req) => {
              if (req.data.code === SUCCESS) {
                  console.log(req)
                  this.setState({
                      email_to_send: "",
                      message_to_send: "",
                      subject_to_send: ""
                  })
                  alert(req.data.detail)
              } else {
                console.log(req)
                alert(req.data.detail)
              }
          })
    }

    handleClick(e) {
        //e.preventDefault();
        if (e.keyCode === 32) {
            this.text2speech(this.state.utterText)
        }
    }


    handleStart() {
        this.setState({
            listening: true
        })
        synth.cancel(); 
    }

    handleEnd(err, text) {

        console.log(text)
        if (!err) {
            this.setState({
                text: text
            })

        } else {
            return;
        }
        this.setState({
            listening: false
        })
        if (this.state.inboxEmail === true) { //inboxdan istedi�i maili sesli ald���m�z i�in menudeki seslerle kar��mamas� ad�na burada ayr� ald�m s�ylenenleri

          

            var option = text //s�yledi�i �ey 

            console.log(option)

            if (option.toLowerCase() === "menu") {  //menu derse geri d�n�yor menudeki se�eneklere
                option = ""
                this.setState({
                    inboxEmail: false,
                    text: ""
                })
                this.text2speech("To Send Email, please say Send Email. To Listen Email, say Listen. and To Exit, say Logout")
            }
            else if (option.toLowerCase() === "restart") {  //restart derse tekrar s�yl�yor mailleri ama garip s�yl�yor de�i�tirmek laz�m
                option = ""
                var speech = "You have " + this.state.InboxMails.length + "  emails."

                this.state.InboxMails.map((item) => {
                    speech = speech + "! . ! From " + item.target + "! . ! Subject " + item.subject
                }) 

                this.text2speech(speech + "! . ! Say the the index of email to listen. menu to return menu and restart to listen list of emails ")
            }
            else {
                if(!isNaN(option)) {
                    var mail = this.state.InboxMails[parseInt(option)  - 1]
                    this.mailContent(mail, 0);
                    this.text2speech("From: " + mail.target + "! . ! Subject:" + mail.subject + "! . ! Content:"  + mail.content);
                } else {
                    this.text2speech("I couldn't get that!");
                } 
            }
        }
        //bo�
        else if (this.state.sentEmail === true) {
            var option = text 

            console.log(option)

            if (option.toLowerCase() === "menu") {  //menu derse geri d�n�yor menudeki se�eneklere
                option = ""
                this.setState({
                    sentEmail: false,
                    text: ""
                })
                this.text2speech("To Send Email, please say Send Email. To Listen Email, say Listen. and To Exit, say Logout")
            }
            else if (option.toLowerCase() === "restart") {  //restart derse tekrar s�yl�yor mailleri ama garip s�yl�yor de�i�tirmek laz�m
                option = ""
                var speech = "You have " + this.state.SentMails.length + "  emails."

                this.state.SentMails.map((item) => {
                    speech = speech + "! . ! To " + item.target + "! . ! Subject " + item.subject
                }) 

                this.text2speech(speech + "! . ! Say the index of email to listen. menu to return menu and restart to listen list of emails ")
            }
            else {
                if(!isNaN(option)) {
                    var mail = this.state.SentMails[parseInt(option)  - 1]
                    this.mailContent(mail, 0);
                    this.text2speech("From: " + mail.target + "! . ! Subject:" + mail.subject + "! . ! Content:"  + mail.content);
                } else {
                    this.text2speech("I couldn't get that!");
                }
                
            }


        }
        else if (this.state.sendEmail === true) {  //s�ylenenleri ay�rabilmek i�in yazd�m
            sendingInfo.push(text)  //bu arrayde tutucak t�m s�ylenenleri tek tek
            console.log(sendingInfo)

            if (sendingInfo[sendingInfo.length - 1].toLowerCase() === "send") {  //email, konu ve i�eri�i yazd�ktan sonra bunun i�ine girip al�cak teker teker

                //sendingInfo[0] = sendingInfo[0].replace(/ /g, "").slice(0, sendingInfo[0].indexOf("atgmail.com")) + "@gmail.com"

                sendingInfo[0] = "mail.system.test123@gmail.com"  //email k�sm�na bunu direk koydurdum, anlam�yor ��nk�

                //Bunlar mail yollama k�sm�ndaki inputlar� dolduruyor
                this.setState({
                    email_to_send: sendingInfo[0],
                    subject_to_send: sendingInfo[1].toLowerCase(),
                    message_to_send: sendingInfo[2].toLowerCase(),
                })

                document.getElementById("address").value = this.state.email_to_send
                document.getElementById("subject").value = this.state.subject_to_send
                document.getElementById("message").value = this.state.message_to_send

                //yaz�lanlar� teyit etmek i�in tekrarl�yor adam correct derse as�l yollama i�lemi olcak
                this.text2speech("If these sending information are correct, please say correct, if not please say restart to start over." 
                + "! . !To:" + this.state.email_to_send + "! . !Subject:" + this.state.subject_to_send + "! . !Message:" + this.state.message_to_send)

            }
            //menu derse menuy� tekrar s�yl�yor ve mail yollama b�l�m�nden ��k�yor.
            if (sendingInfo[sendingInfo.length - 1].toLowerCase() === "menu") {
                sendingInfo = []
                this.setState({
                    sendEmail: false,
                    text: ""
                })
                this.text2speech("To Send Email, please say Send Email. To Listen Email, say Listen. and To Exit, say Logout")


            }
            //restart derse ne s�ylemesi gerekti�i bilgisini veriyor
            else if (sendingInfo[sendingInfo.length - 1].toLowerCase() === "restart") {
                sendingInfo = []
                this.text2speech("Say address, subject, and message")
            }
            //correct derse mail yollama i�lemi olcak ve inputlar�n i�ini s�f�rl�yor
            else if (sendingInfo[sendingInfo.length - 1].toLowerCase() === "correct") {
                sendingInfo = []
                this.text2speech()
                this.handleSendSubmit(null)

                this.setState({
                    email_to_send: "",
                    subject_to_send: "",
                    message_to_send: "",
                })

                document.getElementById("address").value = this.state.email_to_send
                document.getElementById("subject").value = this.state.subject_to_send
                document.getElementById("message").value = this.state.message_to_send
                this.text2speech("Your email is sent successfully ! . !" + "say menu to return to menu or for new email say address, subject, and message and send to sent email")
            }

        }

        else {
            //bu else menuden se�ilenleri arraya kaydediyor
            allText.push(this.state.text)
            console.log(allText)
            //send mail derse mail yollama b�l�m�n� getiriyor ve o b�l�mdeki s�ylenenleri ayr� almas� i�in yukardaki ife yazd�m
            if (allText[allText.length - 1].toLowerCase().replace(/ /g, "") === "sendemail") {
                console.log("send")
                this.sendMail()

                this.text2speech(`Please say the address to send email, subject, and the message respectively. Say send to send the email.
                say restart to start over or say menu to return to menu`)

                this.setState({
                    sendEmail: true,
                    sentEmail: false,
                    inboxEmail: false
                })
                allText = []
            }
            else if (allText[allText.length - 1].toLowerCase() === "listen") {
                this.text2speech("To listen to Inbox emails, say inbox, To listen to Sent emails, say sent.  You can say restart to start over.")
            }
            else if (allText[allText.length - 1].toLowerCase().replace(/ /g, "") === "logout") {
                console.log("logout")
                this.handleLogout(null)
            }
            else if (allText[allText.length - 1].toLowerCase() === "restart") {
                this.text2speech("To Send Email, please say Send Email. To Listen Email, say Listen. and To Exit, say Logout")
                allText = []
            }
            //adam inbox derse inboxdaki mailleri ekrana getiriyor ka� maili var s�yl�yor
            else if (allText[allText.length - 1].toLowerCase() === "inbox") {
                this.inboxFunction()
                var speech = "You have " + this.state.InboxMails.length + "  emails."

                const list = this.state.InboxMails.map((item, index) => {
                    speech = speech + "! . ! From " + item.target + "! . ! Subject " + item.subject
                }) 

                this.text2speech(speech + "! . ! Say the the index of email to listen. menu to return menu and restart to listen list of emails ")
                //�u k�s�mda kafay� yedim de�i�tirebilirsin

                //burdaki s�yledikleri menudeki arrayle kar��mas�n diye ayr� yerde saklamak i�in bir flag, yukar�daki "if" yap�l�yor
                this.setState({
                    sendEmail: false,
                    sentEmail: false,
                    inboxEmail: true
                })

                allText = []

            }
                //bo�
            else if (allText[allText.length - 1].toLowerCase() === "sent" || allText[allText.length - 1].toLowerCase() === "send") {
                this.sentFunction()
                var speech = "You have " + this.state.SentMails.length + "  emails."

                const list = this.state.SentMails.map((item, index) => {
                    speech = speech + "! . ! From " + item.target + "! . ! Subject " + item.subject
                }) 

                this.text2speech(speech + "! . ! Say the the index of email to listen. menu to return menu and restart to listen list of emails ")
                this.setState({
                    sendEmail: false,
                    sentEmail: true,
                    inboxEmail: false
                })
            }
            //menude olmayan bir �ey derse yanl�� opsiyon
            else {
                this.text2speech("Wrong Option, please say again")
                allText = []
            }

        }


    }

    render() {

        if (this.state.initial === true) {
            this.setState({
                initial: false
            })
            this.text2speech("Login successful")
            this.text2speech("To Listen to menu, please hit the spacebar")
        } 
        
      return (
        
          //Layout: "main div=> app_div(has all subdivs)", "header div", "menu div(left side)", "mails list div" and "mail content div"
          <div className="flex-centered">
              <Speech2Text onStart={this.handleStart} onEnd={this.handleEnd} />
              <Spell2Text onStart={this.handleStart} onEnd={this.handleEnd} />
              <div className="app_div">

                  <div className="header_section">
                      <p className="header_title">A Voice Based Email System</p>
                  </div>

                  <div className="menu_div">

                          <ul className="menu">
                              <li className="menu-item">
                                  <div className="tile tile-centered">
                                          <div className="tile-content">Menu</div>
                                   </div>
                              </li>
                               <li className="divider"></li>
                          <li className="menu-item" onClick={this.sendMail}><a href=" #top">Send Email</a>     
                                </li>
                                <li  className="menu-item">
                                    <a href="#top">Listen Email</a>
                                </li> 
                          <li className="menu-item"><a href="#top" onClick={this.handleLogout}>Logout</a>
                                </li> 
                          </ul>

                      <div className="mailbox_div">
                          <h4>Folders</h4>
                          <ul className="mailboxitem_div">

                              <li className="item_div" key={0}>

                                  <button className="btn badge" data-badge={this.state.InboxMails.length} onClick={this.inboxFunction}>
                                      Inbox
                                   </button>


                              </li>

                              <li className="item_div" key={1}>

                                  <button className="btn badge" data-badge={this.state.SentMails.length} onClick={this.sentFunction}>
                                      Sent
                                   </button>

                              </li>
                          </ul>

                      </div>

                   </div>

                  <div className="mails_div">
                      <table className="email-list table table-striped table-condensed">
                          <thead>
                              <tr>
                                  <th width="70%">{this.state.mail_list_header1}</th>
                                  <th width="30%">{this.state.mail_list_header2}</th>
                                 
                              </tr>
                          </thead>
                          <tbody>
                              {this.state.mailsContent}
                          </tbody>
                      </table>
                      
                  </div>

                  <div className="mailcontent_div">
                      {this.state.mailBody}
                  </div>

              </div>
           

          </div>
      )
  }
}

export default Email;