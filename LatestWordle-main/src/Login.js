import React, { Component } from "react";
import Swal from "sweetalert2";
import axios from "axios"
import shortid  from 'shortid';
import {
  firstNamePattern,
  lastNamePattern,
  emailPattern,
  passwordPattern,
} from "./regex.js";
import "./Login.css";
import "./SignUp.css";



class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      firstName: "",
      lastName: "",
      email: "",
      loginEmail: "",
      loginPassword: "",
      password: "",
      repeatPassword: "",
      securityCode: "",
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true,
      passwordValid: true,
      loginPasswordValid: true,
      repeatPasswordValid: true,
      loginEmailValid: true,
      userExits: false,
      loginSuccess:false
    };

    this.backdrop = null;
    this.timer = null;
    this.firstNameModal = false;
    this.lastNameModal = false;
    this.emailModal = false;
    this.passwordModal = false;
    this.repeatPasswordModal = false;
    this.code = "";
  }

  CreateNewAccount = (e) => {
    this.setState({
      active: true,
    });
  };

  onPressCancel = (e) => {
    this.setState({
      active: false,
    });

    window.location.href = "/";
  };

  PasswordRequirements = (e) => {
    // e.preventDefault();

    let str =
      "You Password is invalid. It must meet following requirements\n\nAt least 8-15 characters\nA mixture of both uppercase and lowercase letters\nA mixture of letters and numbers\n";

    Swal.fire({
      position: "top",
      allowOutsideClick: false,
      title: "Password Requirements !!",
      html: "<pre>" + str + "</pre>",
      width: 610,
      padding: "0.7em",
      // Custom CSS
      customClass: {
        heightAuto: false,
        title: "title-class",
        popup: "popup-class",
        confirmButton: "button-class",
      },
    });
  };

  nameRequirements = (title, val) => {
    let checkFirstName = false;
    let checkLastName = false;
    let checkEmail = false;
    let checkPassword = false;
    let checkRepeatPassword = false;
    let str = null;
    let heading = null;

    if (title === "First Name") {
      heading = title + " Requirements !!";
      str =
        title + " must be alpha characters only and between 1 - 30 characters";
      if (firstNamePattern.test(val)) {
        checkFirstName = true;
      }

      if (checkFirstName === false && this.firstNameModal === false) {
        this.firstNameModal = true;
        Swal.fire({
          position: "top",
          allowOutsideClick: false,
          title: heading,
          html: "<pre>" + str + "</pre>",
          width: 750,
          padding: "0.7em",
          // Custom CSS
          customClass: {
            heightAuto: false,
            title: "title-class",
            popup: "popup-class",
            confirmButton: "button-class",
          },
        });
      }

      this.setState({
        firstName: val.toUpperCase(),
        firstNameValid: checkFirstName,
      });
    }

    if (title === "Last Name") {
      heading = title + " Requirements !!";
      str =
        title +
        " must be alpha characters only and cannot be greater than 30 characters";

      if (lastNamePattern.test(val)) {
        checkLastName = true;
      }

      if (checkLastName === false && this.lastNameModal === false) {
        this.lastNameModal = true;
        Swal.fire({
          position: "top",
          allowOutsideClick: false,
          title: heading,
          html: "<pre>" + str + "</pre>",
          width: 805,
          padding: "0.7em",
          // Custom CSS
          customClass: {
            heightAuto: false,
            title: "title-class",
            popup: "popup-class",
            confirmButton: "button-class",
          },
        });
      }

      this.setState({
        lastName: val.toUpperCase(),
        lastNameValid: checkLastName,
      });
    }

    if (title === "Email Requirements") {
      heading = title + " !!";
      str = "Allowed special characters are . _ % + -";

      if (emailPattern.test(val)) {
        checkEmail = true;
      }

      if (checkEmail === false && this.emailModal === false) {
        this.emailModal = true;
        Swal.fire({
          position: "top",
          allowOutsideClick: false,
          title: heading,
          html: "<pre>" + str + "</pre>",
          width: 805,
          padding: "0.7em",
          // Custom CSS
          customClass: {
            heightAuto: false,
            title: "title-class",
            popup: "popup-class",
            confirmButton: "button-class",
          },
        });
      }

      this.setState({
        email: val,
        emailValid: checkEmail,
      });
    }

    if (title === "Password Requirements") {
      heading = title + " !!";
      str =
        "It must meet following requirements\n\nAt least 8-20 characters\nA mixture of both uppercase and lowercase letters\nA mixture of letters and numbers";

      if (passwordPattern.test(val)) {
        checkPassword = true;
      }

      if (val.indexOf(" ") >= 0) {
        checkPassword = false;
      }

      if (checkPassword === false && this.passwordModal === false) {
        this.passwordModal = true;
        Swal.fire({
          position: "top",
          allowOutsideClick: false,
          title: heading,
          html: "<pre>" + str + "</pre>",
          width: 805,
          padding: "0.7em",
          // Custom CSS
          customClass: {
            heightAuto: false,
            title: "title-class",
            popup: "popup-class",
            confirmButton: "button-class",
          },
        });
      }

      this.setState({
        password: val,
        passwordValid: checkPassword,
      });
    }

    if (title === "Repeat Password") {
      heading = title + " !!";
      str = "Password do not match";

      if (this.state.password === val) {
        checkRepeatPassword = true;
      }

      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        this.setState({
          repeatPassword: val,
          repeatPasswordValid: checkRepeatPassword,
        });

        if (checkRepeatPassword === false) {
          Swal.fire({
            position: "top",
            allowOutsideClick: false,
            title: heading,
            html: "<pre>" + str + "</pre>",
            width: 805,
            padding: "0.7em",
            // Custom CSS
            customClass: {
              heightAuto: false,
              title: "title-class",
              popup: "popup-class",
              confirmButton: "button-class",
            },
          });
        }
      }, 1500);
    }
  };

  onInputchange = (event, title) => {
    if (title === "First Name") {
      this.setState({
        firstName: event.target.value,
      });
    }

    if (title === "Last Name") {
      this.setState({
        lastName: event.target.value,
      });
    }

    if (title === "Email Requirements") {
      this.setState({
        email: event.target.value,
      });
    }

    if (title === "Password Requirements") {
      this.setState({
        password: event.target.value,
      });
    }

    if (title === "Repeat Password") {
      this.setState({
        repeatPassword: event.target.value,
      });
    }

    this.nameRequirements(title, event.target.value);
  };

  onPressSignUp = () => {

    let heading = "Input Invalid !!"
    let str = "Please enter the valid input for the boxes highlighed in red."
    let value = false;

    axios.post('https://twoplayerwordle.herokuapp.com/api/signup/create-user', this.state)
    .then(response => {
      console.log(response.data)
      this.setState({
        firstNameValid: response.data.body.firstNameValid,
        lastNameValid: response.data.body.lastNameValid,
        emailValid: response.data.body.emailValid,
        passwordValid: response.data.body.passwordValid,
        repeatPasswordValid: response.data.body.repeatPasswordValid,
        userExits: response.data.body.userExits
      })

      if(this.state.firstNameValid === false || this.state.lastNameValid === false || 
         this.state.emailValid === false || this.state.passwordValid === false ||
         this.state.repeatPasswordValid === false ) {

          Swal.fire({
            position: "top",
            allowOutsideClick: false,
            title: heading,
            html: "<pre>" + str + "</pre>",
            width: 805,
            padding: "0.7em",
            // Custom CSS
            customClass: {
              heightAuto: false,
              title: "title-class",
              popup: "popup-class",
              confirmButton: "button-class",
            },
          });

          value = true;
    
        }

        if(value === false) {

          if(this.state.userExits === true) {

            let stringVal = 'Please log in with registered email and password';
            Swal.fire({
              position: "top",
              allowOutsideClick: false,
              title: "User Already Exists !!",
              html: "<pre>" + stringVal + "</pre>",
              width: 805,
              padding: "0.7em",
              // Custom CSS
              customClass: {
                heightAuto: false,
                title: "title-class",
                popup: "popup-class",
                confirmButton: "button-class",
              },
            }).then((result) => {
              window.location.href = "";
            });
          } else {
            let stringVal = 'Please log in with registered email and password'
            Swal.fire({
              position: "top",
              allowOutsideClick: false,
              title: "User registered successfuly",
              html: "<pre>" + stringVal + "</pre>",
              width: 805,
              padding: "0.7em",
              // Custom CSS
              customClass: {
                heightAuto: false,
                title: "title-class",
                popup: "popup-class",
                confirmButton: "button-class",
              },
            }).then((result) => {
              window.location.href = "/";
            });
          }
        }
     
    }).catch(error => {

    })
  }

  onInputchangeLogin = (e) => {
    this.setState({
      loginEmail: e.target.value
    })
  }

  onInputchangeLoginPassword = (e) => {
    this.setState({
      loginPassword: e.target.value
    })
  }

  onPressLogIn = () => {

    let heading = "Bad Credentials !!"
    let str = "Credentials you entered are not correct"

    axios.post('https://twoplayerwordle.herokuapp.com/api/login/login-user', this.state)
    .then(response => {
     
      this.setState({
        loginPasswordValid: response.data.body.loginPasswordValid,
        loginEmailValid: response.data.body.loginEmailValid,
        loginSuccess: response.data.body.loginSuccess
      })

      if(this.state.loginPasswordValid === false || this.state.loginEmailValid === false|| this.state.loginSuccess === false) {
        Swal.fire({
          position: "top",
          allowOutsideClick: false,
          title: heading,
          html: "<pre>" + str + "</pre>",
          width: 805,
          padding: "0.7em",
          // Custom CSS
          customClass: {
            heightAuto: false,
            title: "title-class",
            popup: "popup-class",
            confirmButton: "button-class",
          },
        }).then(result => {
          window.location.href = "/";
        });
      } else {
        this.code = shortid.generate().substring(0,5);
        let url = 'https://twoplayerwordle.herokuapp.com/api/login/security-code'

        this.setState({
          securityCode: this.code
        })
        
        axios.post(url, this.state)
        Swal.fire({
          position: 'top',
          input: 'text',
          allowOutsideClick: false,
          inputPlaceholder: 'Enter the security code send to your registered email',
          showCancelButton: true,
          confirmButtonColor: 'rgb(208,33,41)',
          confirmButtonText: 'OK',
          width: 550,
          padding: '0.7em',
          customClass: {
            heightAuto: false,
            popup: 'popup-class',
            confirmButton: 'join-button-class ',
            cancelButton: 'join-button-class'
          } 
        }).then((result) => {
          // Check if the user typed a value in the input field
          if(result.value === this.code){
            localStorage.setItem('login', JSON.stringify(true));
            window.location.href = "/welcome";
          } else {
            window.location.href = "/";
          }
        })
        
      }
    }).catch(error => {
      
    })

    

  }

  render() {
    this.backdrop = this.state.active ? "backdrop-active" : "backdrop-inactive";
   
    return (
      <div>
        <div className="login-title">
          <p className="login-game-title">Wordle</p>
        </div>
        <div className="login-line-wordle"> </div>

        <div className="login-container">
          <div className="login-form">
            <div className="login-input">
              <input 
                className="login"
                type="text"
                name="email"
                placeholder="Email"
                value={this.state.loginEmail}
                onChange={(e) =>
                          this.onInputchangeLogin(e)}
              />
            </div>
            <div className="login-input">
              <input 
                className="login"
                type="password"
                name="email"
                placeholder="Password"
                value={this.state.loginPassword}
                onChange={(e) =>
                          this.onInputchangeLoginPassword(e)}
              />
            </div>
            <div>
              <button className="login-button"   onClick={(e) => this.onPressLogIn()}> Log In </button>
            </div>
            <div className="login-line"> </div>
            <div className="login-button-create-account">
              <button
                className="login-create-new-account"
                onClick={(e) => this.CreateNewAccount()}
              >
                {" "}
                Create New Account{" "}
              </button>
            </div>
            {this.state.active && (
              <div>
                <div className={this.backdrop}></div>
                <div className="signup-container">
                  <div className="signup-page">
                    <h1>Sign Up</h1>
                    <p>Please fill in this form to create an account.</p>
                    <div className="signup-line"> </div>

                    <div className="signup-input">
                      <input
                        style={{
                          border:
                            this.state.firstNameValid === false
                              ? "1.5px solid red"
                              : "",
                        }}
                        className="signup-login signup-name"
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={this.state.firstName}
                        onChange={(e) => this.onInputchange(e, "First Name")}
                      />
                      <input
                        style={{
                          border:
                            this.state.lastNameValid === false
                              ? "1.5px solid red"
                              : "",
                        }}
                        className="signup-login signup-name"
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={this.state.lastName}
                        onChange={(e) => this.onInputchange(e, "Last Name")}
                      />
                    </div>
                    <div className="signup-input">
                      <input
                        style={{
                          border:
                            this.state.emailValid === false
                              ? "1.5px solid red"
                              : "",
                        }}
                        className="signup-login"
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={(e) =>
                          this.onInputchange(e, "Email Requirements")
                        }
                      />
                    </div>
                    <div className="signup-input">
                      <input
                        style={{
                          border:
                            this.state.passwordValid === false
                              ? "1.5px solid red"
                              : "",
                        }}
                        className="signup-login"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(e) =>
                          this.onInputchange(e, "Password Requirements")
                        }
                      />
                    </div>
                    <div className="signup-input">
                      <input
                        style={{
                          border:
                            this.state.repeatPasswordValid === false
                              ? "1.5px solid red"
                              : "",
                        }}
                        className="signup-login"
                        type="password"
                        name="repeatPassword"
                        placeholder="Repeat Password"
                        value={this.state.repeatPassword}
                        onChange={(e) =>
                          this.onInputchange(e, "Repeat Password")
                        }
                      />
                    </div>

                    <div className="signup-buttons">
                      <button
                        className="signup-button signup-cancel-button"
                        type="button"
                        onClick={(e) => this.onPressCancel()}
                      >
                        Cancel
                      </button>
                      <button
                        className="signup-button signup-submit-button"
                        type="button"
                        onClick={(e) => this.onPressSignUp()}
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
