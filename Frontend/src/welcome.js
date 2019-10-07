import React from 'react';
import './welcome.css';


class Welcome extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
          
        }
     

    }
    render() {

        return (
           
            <div className="page">
                <div className="logo"></div>
                <div className="header">
                    <h2>Welcome To The Voice Based Email System</h2>
            </div>
               
          <div className="content">
              <div className="col-sm-8 main-section">
               
          

              
              Email
                  <div className="form-group">     
                      <input
                          className="form-input"
                          type="email" placeholder="Email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$"
                          name="email"
                          onInput={this.handleChange}
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
                          pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
                          onInput={this.handleChange}
                          value={this.state.password}
                          name="password"
                          required
                      />
                    </div>
                      <br />

                  <div className="form-group">
                  <div className="btn-group btn-group-block">
                  <button className="btn btn-primary btn-block" type="submit">Login</button>
                      </div>
                      </div>


                      <br />


                  <div className="divider text-center" data-content="OR SIGN UP"></div>

                  
              Email
              <div className="form-group">    
                      <input
                          className="form-input"
                          type="email"
                          placeholder="Email"
                          onInput={this.handleChange}
                          value={this.state.email}
                          name="email"
                          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$"
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
                      value={this.state.password}
                      name="password"
                      pattern="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
                      required

                      />
                      </div>
                  <br />
                  <div className="form-group">
                  <div className="btn-group btn-group-block">
                  <button className="btn btn-primary btn-block" type = "submit">Sign Up</button>
                      </div>
                  </div>
               
              </div>

          </div>

          </div>
      )
  }
}

export default Welcome;