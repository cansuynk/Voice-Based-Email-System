import React from 'react';

class App extends React.Component {
  render(){
      return (
        <div className="container">
            <div className="columns">
            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>

            <div className="col-4 col-lg-6  col-md-8 col-sm-10 col-xs-12">
              <br/>
              <h2 className="text-primary text-center">A Voice Based Email System</h2>
              <div className="form-group">
                <label>Username</label>
                <input className="form-input" type="text" id="input-example-1" placeholder="Username..."/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-input" type="text" id="input-example-1" placeholder="Password..."/>
              </div>
              <div className="form-group">
                  <div className="btn-group btn-group-block">
                      <button className="btn btn-primary btn-lg" type="submit">Login</button>
                  </div>
              </div>
              <br/>
              <div className="divider text-center" data-content="OR SIGN IN"></div>
              <br/>

              <div className="form-group">
                <label>Username</label>
                <input className="form-input" type="text" id="input-example-1" placeholder="Username..."/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input className="form-input" type="text" id="input-example-1" placeholder="Password..."/>
              </div>
              <div className="form-group">
                <label>Repeat Password</label>
                <input className="form-input" type="text" id="input-example-1" placeholder="Password..."/>
              </div>
              
              <div className="form-group">
                <label className="form-switch">
                  <input type="checkbox"/>
                  <i className="form-icon"></i> I agree the terms and conditions
                </label>
              </div>
              <div className="form-group">
                  <div className="btn-group btn-group-block">
                      <button className="btn btn-primary btn-lg" type="submit">Sign in</button>
                  </div>
              </div>

              
            </div>

            <div className="col-4 col-lg-3 col-md-2 col-sm-1 col-xs-0"></div>
            </div>
        </div>
      )
  }
}

export default App;
