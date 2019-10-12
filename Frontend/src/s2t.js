import React from 'react';


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = false
recognition.lang = 'en-US'

class Speech2Text extends React.Component {
  constructor() {
    super()
    this.state = {
      listening: false,
      text: ""
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }


  componentDidMount(){
    document.addEventListener('keyup', this.toggleListen)
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.toggleListen)
  }

  toggleListen(event) {
    if (event.keyCode ===  27) {
      this.setState({
        listening: !this.state.listening
      }, this.handleListen)
    }
  }
    
 
  handleListen(){
    if (this.state.listening) {
      recognition.start()
      this.props.onStart()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }
    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped Listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }

    recognition.onresult = (event) => {
        var transcript = event.results[0][0].transcript
        this.setState({
          listening: false
        })
        this.props.onEnd(null, transcript)
    }

    recognition.onerror = event => {
      this.props.onEnd(event.error, null)
    }
  }
  render() {
    return (<div></div>);
  }
  
}

export default Speech2Text;
