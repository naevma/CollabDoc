import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

import Draft from './component/draft';
import Login from './component/login'
import Register from './component/register'
import Document from './component/document'
import Content from './component/content'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Home'
    }
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
              <AppBar title="Google Docs" />
              <h1>Welcome to Google Docs Clone</h1>
              <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <RaisedButton label = "Login" primary = {true} onClick = {() => this.redirect('Login')}/>
                <p> OR </p>
                <RaisedButton label = "Register" secondary = {true} onClick = {() => this.redirect('Register')}/>
              </div>
            </div>
        </MuiThemeProvider> : null }
      {this.state.currentPage === 'Login' ?  <Login redirect = {this.redirect} /> : null}
      {this.state.currentPage === 'Register' ?  <Register redirect = {this.redirect}/>  : null}
      {this.state.currentPage === 'Document' ? <Document redirect = {this.redirect} /> : null}
      {this.state.currentPage === 'Content' ? <Content redirect = {this.redirect}/> : null}
    </div>
    );
  }
}

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
});
