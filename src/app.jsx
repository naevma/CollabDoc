import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import io from 'socket.io-client';

import Draft from './component/draft';
import Login from './component/login'
import Register from './component/register'
import Document from './component/document'
import Content from './component/content'
import _ from 'underscore';


export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Content',
      open: false,
      show: null,
      connecting: true
    }
  }

  componentDidMount() {
    this.socket = io('http://7382e430.ngrok.io')
    this.socket.on('connect', () => this.setState({connecting: null}))
    this.socket.on('disconnect', () => this.setState({connecting: true}))
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  redirect = (page) => {
    this.setState({
      currentPage: page
    })
  }

  render() {
    return (
      <div>
      {this.state.currentPage === 'Home' ? <MuiThemeProvider muiTheme={muiTheme}>
            <div id="content" className = "text-center">
              <AppBar title="Google Docs" onLeftIconButtonClick = {this.handleToggle} />
              <Drawer
                docked = {false}
                width = {200}
                open = {this.state.open}
                onRequestChange = {(open) => this.setState({open})}>

                <AppBar title = "Menu" showMenuIconButton={false} />
                <MenuItem onClick = {() => this.redirect('Home')}>Home</MenuItem>
                <MenuItem onClick = {() => this.redirect('Login')}>Login</MenuItem>
                <MenuItem onClick = {() => this.redirect('Register')}>Register</MenuItem>
              </Drawer>

              <div className = "text-center" style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <div style = {{backgroundColor: '#e0e2e5', padding: '5%'}}>
                  <h1>Log in to get started</h1>
                  <RaisedButton label = "Login" primary = {true} onClick = {() => this.redirect('Login')}/>
                </div>
                <p> Not a user? Register here to create an account </p>
                <RaisedButton label = "Register" secondary = {true} onClick = {() => this.redirect('Register')}/>
              </div>
            </div>
        </MuiThemeProvider> : null }
      {this.state.currentPage === 'Login' ?  <Login redirect = {this.redirect} /> : null}
      {this.state.currentPage === 'Register' ?  <Register redirect = {this.redirect}/>  : null}
      {this.state.currentPage === 'Document' ? <Document redirect = {this.redirect} /> : null}
      {this.state.currentPage === 'Content' ? <Content redirect = {this.redirect} socket = {this.socket}/> : null}
      {/* {this.state.currentPage === 'viewDoc' ?  <Register redirect = {this.redirect}/>  : null}
      {this.state.currentPage === 'addDoc' ? <Document redirect = {this.redirect} /> : null}
      {this.state.currentPage === 'createDoc' ? <Content redirect = {this.redirect}/> : null} */}
    </div>
    );
  }
}

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
});
