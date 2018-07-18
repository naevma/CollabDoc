import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class AddDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      documentID: '',
      password: ''
    }
  }

  onChangeDocID = (e) => {
    this.setState({
      documentID: e.target.value
    })
  }

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  onClick = () => {

    const {documentID, password} = this.state;
    console.log("document", documentID)

    fetch('http://373431e5.ngrok.io/adddoc', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        documentID,
        password
      })
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("Success!")
      }
      else {
        // error
        console.log('error')
      }
    })
    // .then((responseJson) => {
    //   if (responseJson.success){
    //     // navigate to draft js or the editor
    //   }
    //   console.log("response JSON", responseJson)
    // })
    .catch((err) => {
      /* do something if there was an error with fetching */
    });
  }

  render() {
    return (
      <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>

        <div>
          <TextField
            hintText="Document ID"
            floatingLabelText = "Document ID"
            type = "text"
            value = {this.state.documentID}
            onChange={(event) => this.onChangeDocID(event)}
          />

        </div>

        <div><TextField
          hintText = "Password"
          floatingLabelText = "Password"
          type = "password"
          value = {this.state.password}
          onChange={(event) => this.onChangePassword(event)}

        /></div>
        <div
          style={{ textAlign: 'center'}}
          >

            <RaisedButton
              onClick={() => this.onClick()}
              label="Add Doc" primary={true}  />
            </div>



          </div>
        );
      }
    }

    export default AddDoc;
