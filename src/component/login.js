import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';

export default class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Login',
      username: '',
      password: '',
      usernameFieldErr: '',
      passwordFieldErr: '',
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

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  login = () => {
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

    else if (this.state.username && this.state.password) {

      const {username, password} = this.state;

      fetch('http://46a1cca4.ngrok.io/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify({
          username,
          password
        })
      })
      .then((response) => {
        //debugger;
        if (response.status === 200) {
          this.props.redirect('Content')
        }
        else {
          console.log("error");
        }
      })
      // .then((responseJson) => {
      //   console.log('response 2', responseJson)
      //   if (responseJson.success){
      //     this.props.redirect('Content')
      //   }
      //   else {
      //     console.log("ERROR", responseJson.error)
      //   }
      // })
      .catch((err) => {
        console.log("ANOTHA ERR", err)
        /* do something if there was an error with fetching */
      });
    }
  }

  render() {
    return (
      <div className = "text-center">
        {this.state.currentPage === "Login" ? <MuiThemeProvider muiTheme={muiTheme}><div>
          <AppBar title="Login" onLeftIconButtonClick = {this.handleToggle} />
          <Drawer
            docked = {false}
            width = {200}
            open = {this.state.open}
            onRequestChange = {(open) => this.setState({open})}>

            <AppBar title = "Menu" showMenuIconButton={false} />
            <MenuItem onClick = {() => this.props.redirect('Home')}>Home</MenuItem>
          </Drawer>
          <div style = {{position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -20%)'}}>
            <ListItem
              disabled={true}
              leftAvatar={<Avatar>A</Avatar>}
              >
              </ListItem>
            </div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <div>
              <TextField
                type = "text"
                hintText = "Enter your username"
                floatingLabelText = "Username"
                value = {this.state.username}
                errorText = {this.state.usernameFieldErr}
                onChange = {event => this.setUsername(event)}
              /><br />
              <TextField
                type = "password"
                hintText="Enter your password"
                floatingLabelText = "Password"
                value = {this.state.password}
                errorText = {this.state.passwordFieldErr}
                onChange = {event => this.setPassword(event)}
                style = {{marginBottom: '5%'}}
              /><br />
              <RaisedButton label = "Login" primary = {true} onClick = {() => this.login()}/>
              <div style = {{marginTop: '40%' }}>
                <p> Or back to the home screen </p>
                <RaisedButton label = "HOME" secondary = {true} onClick = {() => this.props.redirect('Home')}/>
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
