import React from 'react';


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()

recognition.continous = true
recognition.interimResults = false
recognition.lang = 'en-US'

var a=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em
function beep(vol, freq, duration){
 var v=a.createOscillator()
 var u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="square"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}

class Speech2Text extends React.Component {
  constructor() {
    super()
    this.state = {
      listening: false,
      started: false,
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
      if (!this.state.listening) {
        beep(20,100,150) //Listen Start Noise
      } else {
        beep(20,200,150) //Listen Start Noise
      }
      this.setState({
        listening: !this.state.listening
      }, this.handleListen)
    }
  }
    
 
  handleListen(){
    if (this.state.listening) {
      if (!this.state.started) {
        recognition.start()
        this.setState({started: true})
        this.props.onStart()
        recognition.onend = () => {
          console.log("...continue listening...")
          recognition.start()
        }
      }
    } else {
      recognition.stop()
      recognition.onend = () => {
        this.setState({started: false})
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
    return (<div>
    </div>);
  }
  
}

export default Speech2Text;
