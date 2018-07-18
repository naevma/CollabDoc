import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


export default class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Register',
      username: '',
      password: '',
      repeatPassword: ''
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
      repeatPassword: event.target.value
    })
  }

  register = () => {

    const {username, password, repeatPassword} = this.state;

    fetch('', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password,
        repeatPassword
      })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      else {
        // error
      }
    })
    .then((responseJson) => {
      if (responseJson.success){
        this.props.redirect('Home')
      }
      console.log("response JSON", responseJson)
    })
    .catch((err) => {
      /* do something if there was an error with fetching */
    });
  }

  render() {
    return (
      <div className = "text-center">
        {this.state.currentPage === 'Register' ?<MuiThemeProvider muiTheme={muiTheme}><div>
            <AppBar title="Register" />
            <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <TextField
              type = "text"
              placeholder="Enter a username"
              value = {this.state.username}
              onChange = {event => this.setUsername(event)}
            /><br />
            <TextField
              type = "password"
              placeholder="Enter a password"
              value = {this.state.password}
              onChange = {event => this.setPassword(event)}
            /><br />
            <TextField
              type = "password"
              placeholder="Repeat password"
              value = {this.state.repeatPassword}
              onChange = {event => this.setRepeatPassword(event)}
              style = {{marginBottom: '5%'}}
            /><br />
            <RaisedButton label = "Register" secondary = {true} onClick = {() => this.register()}/>
            <p> OR </p>
            <RaisedButton label = "BACK" secondary = {true} onClick = {() => this.props.redirect('Home')}/>
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
