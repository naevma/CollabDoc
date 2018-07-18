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
import FileFolder from 'material-ui/svg-icons/file/folder';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import {blue500, yellow600} from 'material-ui/styles/colors';
import EditorInsertChart from 'material-ui/svg-icons/editor/insert-chart';


class ViewDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      documents: []
    }
  }

  componentDidMount() {
    fetch('http://373431e5.ngrok.io/viewdoc', {
      method: 'GET'
    })
    .then((response) => {
      console.log('response', response)
      if (response.status === 200) {
        console.log("Success!")
        this.setState({
          documents: // response
        })
      }
      else {
        // error
        console.log("ERRORR")
      }
    })
    // .then((responseJson) => {
    //   console.log("responseJson1", responseJson)
    //   if (responseJson.success){
    //     console.log("responseJSON", responseJson.success)
    //     // this.setState({
    //     //   dataSource: responseJson.users
    //     // })
    //   }
    //   else {
    //     console.log("ERROR", responseJson.error)
    //     this.setState({
    //       message: responseJson.error
    //     })
    //   }
    // })
    .catch((err) => {
      /* do something if there was an error with fetching */
    });
  }


  render() {
    return (
      <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <List>
          {this.state.documents.map((doc) => <ListItem
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
            primaryText= //doc.text
            secondaryText= // doc.date
          />)}
          <ListItem
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
            primaryText="Vacation itinerary"
            secondaryText="Jan 20, 2018"
          />
          <ListItem
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500} />}
            primaryText="Europe Trip"
            secondaryText="March 10, 2018"
          />

        </List>
      </div>
    );
  }
}

export default ViewDocs;
