import React from 'react';
import {Editor, EditorState} from 'draft-js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar'

import ViewDoc from './viewDocs';
import CreateDoc from './createDoc';
import AddDoc from './addDoc';

const paperStyle = {
  height: '85%',
  width: '85%',
  margin: '7%',
  textAlign: 'center',
  display: 'inline-block'
}

export default class Content extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentPage: 'Content',
      open: false,
      show: null
    }
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  showView = () => {
    this.setState({
      show: 'View'
    })
  }

  showCreate = () => {
    this.setState({
      show: 'Create'
    })
  }

  showAdd = () => {
    this.setState({
      show: 'Add'
    })
  }

  redirect = (page) => {
    this.setState({
      show: page
    })
  }

  render() {
    // let content = null;
    // switch(this.state.show) {
    //   case 'View':
    //     content = ({this.state.currentPage === 'Login' ?  <ViewDoc redirect = {this.redirect} />});
    //     break;
    //   case 'Create':
    //     content = (<CreateDoc redirect = {this.redirect} />)
    //     break;
    //   case 'Add':
    //     content = (<AddDoc redirect = {this.redirect}/>)
    //     break;
    //   default:
    //     content = <h1>Waiting</h1>
    // }
    return (
      <div className = "text-center">
        {this.state.currentPage === "Content" ? <MuiThemeProvider muiTheme={muiTheme}><div>
          <AppBar
            title="Content"
            onLeftIconButtonClick = {this.handleToggle}
          />
          <Drawer
            docked = {false}
            width = {200}
            open = {this.state.open}
            onRequestChange = {(open) => this.setState({open})}>

            <AppBar title = "Menu" showMenuIconButton={false}/>
            <MenuItem onClick = {() => this.props.redirect('Home')}>Home</MenuItem>
            <MenuItem onClick = {this.showView}>View Docs</MenuItem>
            <MenuItem onClick = {this.showCreate}>Create Docs</MenuItem>
            <MenuItem onClick = {this.showAdd}>Add Docs</MenuItem>
          </Drawer>
          <Paper style = {paperStyle} zDepth={5}>
            <h1>Welcome to this beautiful, fire page.</h1>
            <p>Press the menu bar to access your amazing documents.</p>
            {this.state.show === 'View' ?  <ViewDoc redirect = {this.redirect}/>  : null}
            {this.state.show === 'Add' ? <AddDoc redirect = {this.redirect} /> : null}
            {this.state.show === 'Create' ? <CreateDoc redirect = {this.redirect}/> : null}
          </Paper>
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
