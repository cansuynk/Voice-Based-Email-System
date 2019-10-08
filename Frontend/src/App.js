import React from 'react';
import Welcome from "./welcome"
import Email from "./email"
import Axios from "axios"
import {SUCCESS} from "./error_codes"

class App extends React.Component {
  constructor(){
    super();
    this.state = { 
      auth: false
    }
    this.check_auth = this.check_auth.bind(this);
  }
  check_auth(){
      Axios.get("/auth/fetch_user").then((req) => {
        if (req.data.code === SUCCESS) {
          this.setState({
            auth: true
          })
        } else {
          this.setState({
            auth: false
          })
        }
      })
  }

  componentDidMount(){
    this.check_auth()
  }
    render() {

        //This is the example structure of the mails. This example is used for testing the interface
        var fixtures = [
            {
                id: 1,
                name: "Inbox",
                emails: [
                    {
                        id: 1,
                        from: "joe@tryolabs.com",
                        to: "fernando@tryolabs.com",
                        subject: "Meeting",
                        body: "hi"
                    },
                    {
                        id: 2,
                        from: "newsbot@tryolabs.com",
                        to: "fernando@tryolabs.com",
                        subject: "News Digest",
                        body: "<h1>Intro to React</h1> <img src='https://raw.githubusercontent.com/wiki/facebook/react/react-logo-1000-transparent.png' width=300/)>"
                    },
                    {
                        id: 2,
                        from: "newsbot@tryolabs.com",
                        to: "fernando@tryolabs.com",
                        subject: "News Digest",
                        body: "adaldmvladmvkadmvkladmvkdmvlkdmvladmvjsr�srjfj�"
                    }
                ]
            },
            {
                id: 2,
                name: "Sent",
                emails: [
                    {
                        id: 3,
                        from: "nigerian.prince@gmail.com",
                        to: "fernando@tryolabs.com",
                        subject: "Obivous 419 scam",
                        body: "You've won the prize!!!1!1!!!"
                    }
                ]
            }
        ];

      return (
        <div className="container">
            <div className="columns">
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>

            <div className="col-4 col-lg-6  col-md-8 col-sm-10 col-xs-12">
              {this.state.auth ? <Email mailboxes={fixtures}/> : <Welcome ask_auth={this.check_auth}/> }
            </div>

            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            </div>
        </div>
      )
  }

}




export default App;
