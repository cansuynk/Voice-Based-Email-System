import React from 'react';
import Speech2Text from "./s2t.js";




class App extends React.Component {
  constructor() {
    super()
    this.state = {
      listening: false,
      text: "",
    }

    this.handleEnd= this.handleEnd.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

    handleStart() {
      this.setState({
          listening: true
      })
  }

  handleEnd(err, text) {
      console.log(text)
      if (!err) {
          this.setState({
              text: text
          })
      } else {
          console.log(err)
      }
      this.setState({
          listening: false
      })
  }



  
  render() {
    return (
      <div className="container">
              <div className="columns">
              <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
  
              <div className="col-4 col-lg-6  col-md-8 col-sm-10 col-xs-12">
                    {this.state.listening ? <h4>I am listening ....</h4> : <h4>Press Enter to speak</h4>}
                    <Speech2Text onStart={this.handleStart}  onEnd={this.handleEnd}/>
                    {<h4>{this.state.text}</h4>}
              </div>
  
              <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
              </div>
          </div>
    );
  }
  
}

export default App;