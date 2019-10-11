import React from 'react';
import './welcome.css';
import Axios from 'axios';
import { SUCCESS } from './error_codes';
import Speech from 'speak-tts'


class Welcome extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            username: "",
            email_for_registration: "",
            password_for_registration: "",
            speech: new Speech()
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
        this.handleSignSubmit = this.handleSignSubmit.bind(this);
        this.Speak = this.Speak.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLoginSubmit(e) {
        e.preventDefault()
        Axios.post("/auth/login", {"address": this.state.email, "password": this.state.password}).then((req) => {
            if (req.data.code === SUCCESS) {
                this.props.ask_auth()
            } else {
                alert(req.data.detail)
            }
        })
    }

    handleSignSubmit(e) {
        e.preventDefault()
        Axios.post("/auth/sign_in", {"address": this.state.email_for_registration,"username": this.state.username ,"password": this.state.password_for_registration}).then((req) => {
            if (req.data.code === SUCCESS) {
                this.props.ask_auth()
            } else {
                alert(req.data.detail)
            }
        })
    }

    componentDidMount() {
        this.state.speech.init().then((data) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log("Speech is ready, voices are available", data)
        }).catch(e => {
            console.error("An error occured while initializing : ", e)
        })
        document.addEventListener('keypress', this.Speak)
    }

    componentWillUnmount() {
        document.removeEventListener("keypress", this.Speak)
    }
    Speak(event) {
       
        if (event.keyCode === 32) {
            

            this.state.speech.speak({
                text: 'Hello, how are you today?',
            }).then(() => {
                console.log("Su     ccess !")
            }).catch(e => {
                console.log(e)
            })

        }
        

    }
    /*
    Speak() {
       
        
        speech.init({
            'volume': 1,
            'lang': 'en-GB',
            'rate': 1,
            'pitch': 1,
            'voice': 'Google UK English Male',
            'splitSentences': true,
            'listeners': {
                'onvoiceschanged': (voices) => {
                    console.log("Event voiceschanged", voices)
                }
            }
        })
        
        speech.speak({
            text: 'Welcome To The Voice Based Email System',
            queue: false, // current speech will be interrupted,
            listeners: {
                onstart: () => {
                    console.log("Start utterance")
                },
                onend: () => {
                    console.log("End utterance")
                },
                onresume: () => {
                    console.log("Resume utterance")
                },
                onboundary: (event) => {
                    console.log(event.name + ' boundary reached after ' + event.elapsedTime + ' milliseconds.')
                }
            }
        }).then(() => {
            console.log("Success !")
        }).catch(e => {
            console.error("An error occurred :", e)
        })
       


    }
 */

   


    render() {
        this.state.speech.speak({
            text: 'Hit spacebar to listen voice assistant',
        }).then(() => {
            console.log("Su     ccess !")
        }).catch(e => {
            console.log(e)
        })
       

        return (



            <div className="page">

                
                    
                <div className="logo"></div>
                <div className="header">
                    <h2>Welcome To The Voice Based Email System</h2>
                </div>

                <div className="content">
                    <div className="col-sm-8 main-section">

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