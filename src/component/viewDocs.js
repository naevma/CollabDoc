import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper'
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';

import Draft from './draft'
import Content from './content'

const paperStyle = {
  height: '85%',
  width: '85%',
  margin: '7%',
  textAlign: 'center',
  display: 'inline-block'
}

class ViewDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'viewDoc',
      documents: [],
      message: ''
    }
  }

  componentDidMount() {
    fetch('http://7382e430.ngrok.io/viewdoc', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then((response) => {
      console.log('response', response)
      // if (response.status === 200) {
      console.log("Success!")
      return response.json()
      // }
      // else {
      //   // error
      //   console.log("ERRORR")
      // }
    })
    .then((responseJson) => {
      console.log("responseJson1", responseJson)
      if (responseJson.success){
        console.log("responseJSON", responseJson.success)
        this.setState({
          documents: responseJson.data
        })
      }
      else {
        console.log("ERROR", responseJson.error)
        // this.setState({
        //   message: responseJson.error
        // })
      }
    })
    .catch((err) => {
      console.log("ERROR", err)
      /* do something if there was an error with fetching */
    });
  }

  render() {
    return (
      <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        {this.state.documents.length === 0 ? <Paper style = {paperStyle} zDepth={5}>
          <h1>You currently have no documents.</h1>
          <p> Please create or add one to view your document</p>
        </Paper>  :
          <List>
          {this.state.documents.map((doc, index) =>
            <ListItem
              key = {index}
              leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500}/>}
              primaryText = {doc.title}
              secondaryText = {new Date(doc.created).toString().slice(0,15)}
              onClick = {() => this.props.redirect('draft', {title: doc.title, contentHistory: doc.contentHistory, id: doc._id})}
            />)}
          </List>}
        </div>
      );
    }
  }

  export default ViewDocs;
