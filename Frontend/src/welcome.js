import React from 'react';
import './welcome.css';
import Axios from 'axios';
import { SUCCESS } from './error_codes';
import Speech2Text from "./s2t.js";
import Spell2Text from "./spell2text.js"



var synth = window.speechSynthesis
var allText = []
class Welcome extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            username: "",
            email_for_registration: "",
            password_for_registration: "",
            initial: true,
            text: "",
            listening: false,
            count:0
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleSignSubmit = this.handleSignSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleStart = this.handleStart.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    text2speech(text) {
        synth.cancel()
        var utterThis = new SpeechSynthesisUtterance(text);
        synth.speak(utterThis);
    }

    handleLoginSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        Axios.post("/auth/login", {"address": this.state.email, "password": this.state.password}).then((req) => {
            if (req.data.code === SUCCESS) {
                this.props.ask_auth()
            } else {
                alert(req.data.detail)
                this.text2speech(req.data.detail)

                this.setState({
                    email: "",
                    password: "",
                    email_for_registration: "",
                    username: "",
                    password_for_registration: ""

                })

                allText = []
            }
        })
    }

    handleSignSubmit(e) {
        if (e){
            e.preventDefault();
        }
        Axios.post("/auth/sign_in", {"address": this.state.email_for_registration,"username": this.state.username ,"password": this.state.password_for_registration}).then((req) => {
            if (req.data.code === SUCCESS) {
                this.props.ask_auth()
            } else {
                alert(req.data.detail)
                this.text2speech(req.data.detail)
                this.setState({
                    email: "",
                    password: "",
                    email_for_registration: "",
                    username: "",
                    password_for_registration: ""



                })
                allText = []
            }
        })
    }

    handleClick(e) {
        //e.preventDefault();
        if (e.keyCode === 32) {
            this.text2speech(`To create a new account, please say "New account" and say your gmail address, username, and password respectively. OR
            To enter to your existing account, please say "log in", and say your gmail address and password. Then Say "Submit" for operation.
            Use the "Escape key", to start, and end your speech. You can say "restart" to start over.`)
        }
    }
    
    componentDidMount() {
        document.addEventListener('keypress', this.handleClick)    
    }

    componentWillUnmount() {
        synth.cancel()
        document.removeEventListener('keypress', this.handleClick)
    }
    handleStart() {
        this.setState({
            listening: true
        })
        synth.cancel()
    }
   
    handleEnd(err, text) {

        console.log(text)
        if (!err) {
            if (text.toLowerCase().replace(/ /g, "") === "restart") {
                allText = []
                this.setState({
                    listening: false
                })
                return;
            }
            if (text === "") {
                this.setState({
                    listening: false
                })
                return;
            }
            this.setState({
                text: text
            })
        } else {
            console.log(err)
        }
        this.setState({
            listening: false
        })

        allText.push(text)
        console.log(allText)

        if (allText[allText.length - 1].toLowerCase() === "submit") {

            allText[1] = allText[1].slice(0, allText[1].indexOf("atgmail.com")) + "@gmail.com"
         
            if (allText[0].toLowerCase().replace(/ /g, "") === "login") {

                this.setState({
                    email: allText[1].toLowerCase().replace(/ /g, ""),
                    password: allText[2].toLowerCase(),

                })
                this.handleLoginSubmit(null);
            }
            else if (allText[0].toLowerCase().replace(/ /g, "") === "newaccount"){
                this.setState({
                    email_for_registration: allText[1].toLowerCase().replace(/ /g, ""),
                    username: allText[2].toLowerCase(),
                    password_for_registration: allText[3].toLowerCase(),

                })
                this.handleSignSubmit(null);
            }

        }
    }
    
    render() {
        if (this.state.initial === true) {
            this.setState({
                initial: false
            })
            this.text2speech("Welcome To The Voice Based Email System. Please hit the spacebar to listen voice assistant")
        } 
       
        return (

            <div className="page">  
                    
                <div className="logo"></div>
                <div className="header">
                    <h2>Welcome To The Voice Based Email System</h2>
                </div>

                <div className="content">
                    <div className="col-sm-8 main-section">
                       
                        <Speech2Text  onStart={this.handleStart} onEnd={this.handleEnd} />
                        <Spell2Text onStart={this.handleStart} onEnd={this.handleEnd} />
  

                       
                   

                        <form onSubmit={this.handleLoginSubmit}>
                            Email
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="email" placeholder="Email"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$"
                                    name="email"
                                    onChange={this.handleChange}
                                    value={this.state.email}
                                    required
                                />
                            </div>
                            Password
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="password"
                                    placeholder="Password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    name="password"
                                    required
                                />
                            </div>
                            <br />

                            <div className="form-group">
                                <div className="btn-group btn-group-block">
                                    <button className="btn btn-primary btn-block" type="submit" value="Submit">Login</button>
                                </div>
                            </div>
                        </form>

                        <br />
                        <div className="divider text-center" data-content="OR SIGN UP"></div>
                        <form onSubmit={this.handleSignSubmit}>
                            Email
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="email"
                                    placeholder="Email"
                                    onChange={this.handleChange}
                                    value={this.state.registrationmail}
                                    name="email_for_registration"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$"
                                    required
                                />
                            </div>
                            Username
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type=""
                                    placeholder="Username"
                                    onChange={this.handleChange}
                                    value={this.state.username}
                                    name="username"
                                    required
                                />
                            </div>
                            Password
                            <div className="form-group">
                                <input
                                    className="form-input"
                                    type="password"
                                    placeholder="Password"
                                    onInput={this.handleChange}
                                    value={this.state.registrationpassword}
                                    name="password_for_registration"
                                    required
                                />
                            </div>

                            <br />
                            <div className="form-group">
                                <div className="btn-group btn-group-block">
                                    <button className="btn btn-primary btn-block" type="submit">Sign Up</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        )
    }
}

export default Welcome;