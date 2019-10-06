import React from 'react';
import Welcome from "./welcome"
import Email from "./email"

class App extends React.Component {
  constructor(){
    super();
    this.state = { 
      auth: true
    }
  }
  render(){
      return (
        <div className="container">
            <div className="columns">
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>

            <div className="col-4 col-lg-6  col-md-8 col-sm-10 col-xs-12">
              {this.state.auth ? <Email/> : <Welcome/> }
            </div>

            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            </div>
        </div>
      )
  }
}

export default App;
