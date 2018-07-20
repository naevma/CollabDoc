import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


export default class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Register',
      username: '',
      password: '',
      passwordRepeat: '',
      usernameFieldErr: '',
      passwordFieldErr: '',
      repeatPasswordFieldErr: '',
      open: false,
      show: null
    }
  }

  setUsername = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  setPassword = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  setRepeatPassword = (event) => {
      this.setState({
        passwordRepeat: event.target.value
      })
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  register = () => {
    if (this.state.username === ""){
      this.setState({
        usernameFieldErr: 'Please enter a username'
      })
    }
    if (this.state.password === ""){
      this.setState({
        passwordFieldErr: 'Please enter a password'
      })
    }
    if (this.state.passwordRepeat === ""){
      this.setState({
        repeatPasswordFieldErr: 'Please confirm your password'
      })
    }
    if (this.state.passwordRepeat !== this.state.password){
      this.setState({
        repeatPasswordFieldErr: 'Your passwords do not match. Please try again.'
      })
    }

    else if (this.state.username && this.state.password && this.state.passwordRepeat) {
      const {username, password, passwordRepeat} = this.state;

      fetch('http://697b5db9.ngrok.io/signup', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
          passwordRepeat
        })
      })
      .then((response) => {
        if (response.status === 200) {
          this.props.redirect('Home')
        }
        else {
          // error
          console.log("ERRORR")
        }
      })
      .catch((err) => {
        /* do something if there was an error with fetching */
      });
    }
  }

  render() {
    return (
        <div className = "text-center">
          {this.state.currentPage === 'Register' ?<MuiThemeProvider muiTheme={muiTheme}><div>
              <AppBar title="Register" onLeftIconButtonClick = {this.handleToggle}/>
              <Drawer
                docked = {false}
                width = {200}
                open = {this.state.open}
                onRequestChange = {(open) => this.setState({open})}>

                <AppBar title = "Menu" showMenuIconButton={false} />
                <MenuItem onClick = {() => this.props.redirect('Home')}>Home</MenuItem>
              </Drawer>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              <TextField
                type = "text"
                hintText ="Enter a username"
                floatingLabelText = "Username"
                value = {this.state.username}
                errorText = {this.state.usernameFieldErr}
                onChange = {event => this.setUsername(event)}
              /><br />
              <TextField
                type = "password"
                hintText = "Enter a password"
                floatingLabelText = "Password"
                value = {this.state.password}
                errorText = {this.state.passwordFieldErr}
                onChange = {event => this.setPassword(event)}
              /><br />
              <TextField
                type = "password"
                hintText = "Repeat password"
                floatingLabelText = "Repeat password"
                value = {this.state.passwordRepeat}
                errorText = {this.state.repeatPasswordFieldErr}
                onChange = {event => this.setRepeatPassword(event)}
                style = {{marginBottom: '5%'}}
              /><br />
              <RaisedButton label = "Register" secondary = {true} onClick = {() => this.register()}/>
              <div style = {{position: 'absolute', marginTop: '40%' }}>
                <p>Already registered? Click the button below to login </p>
                <RaisedButton label = "LOGIN" primary = {true} onClick = {() => this.props.redirect('Login')}/>
              </div>
            </div>
            </div>
          </div>
            </MuiThemeProvider> : <App />}
      </div>


    );
  }
}

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
});
