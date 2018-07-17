import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


export default class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Login',
      username: '',
      password: ''
    }
  }

  login = () => {

    const {username, password} = this.state;

      fetch('', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      })
      .then((response) => {
          return response.json();
      })
      .then((responseJson) => {
        if (responseJson.success){
          this.props.redirect('Home')
        }
        else {
          console.log("ERROR", responseJson.error)
        }
      })
      .catch((err) => {
        console.log("ANOTHA ERR", err)
        /* do something if there was an error with fetching */
      });
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

  render() {
    return (
      <div className = "text-center">
        {this.state.currentPage === "Login" ? <MuiThemeProvider muiTheme={muiTheme}><div>
          <AppBar title="Login" />
          <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
          <TextField
            type = "text"
            placeholder="Enter your username"
            value = {this.state.username}
            onChange = {event => this.setUsername(event)}
          /><br />
          <TextField
            type = "password"
            placeholder="Enter your password"
            value = {this.state.password}
            onChange = {event => this.setPassword(event)}
            style = {{marginBottom: '5%'}}
          /><br />
          <RaisedButton label = "Login" primary = {true} onClick = {() => this.props.redirect('Content')}/>
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
