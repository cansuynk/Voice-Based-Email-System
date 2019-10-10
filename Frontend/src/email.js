import React from 'react';
import './email.css';
import Axios from 'axios';
import { SUCCESS } from './error_codes.js';


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
            message_to_send: ""


        };
}

    componentDidMount() {
        this.get_emails()
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
    inboxFunction() {

        //This function is for listing mails that are received.
        const list = this.state.InboxMails.map((item, index) => 
     
            <tr key={index} onClick={() => this.mailContent(item, 0)}>
                <td>{item.from}</td>
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
                <td>{item.to}</td>
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
        var address = item.from
        if (id === 1) {
            from_to = "To: "    //If a sent mail is wanted to display
            address = item.to
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
                            <input className="form-input" id="input-example-4"
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
                            <input className="form-input" id="input-example-5"
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
                            <textarea className="form-input" id="input-example-6"
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
        e.preventDefault();
        Axios.get("/auth/logout").then((req) => {
            if (req.data.code !== SUCCESS) {
                alert(req.data.detail)
            }
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
        e.preventDefault()
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
    render() {
        
      return (
        
          //Layout: "main div=> app_div(has all subdivs)", "header div", "menu div(left side)", "mails list div" and "mail content div"
          <div className="flex-centered">
              
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