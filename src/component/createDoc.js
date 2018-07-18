import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class CreateDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      title: '',
      password:''
    }
  }

  onChangeTitle= (e) => {
    this.setState({
      title: e.target.value
    })
  }

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  onClick = () => {

    const {title, password} = this.state;
    console.log("title", title)

    fetch('http://373431e5.ngrok.io/createdoc', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
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
            hintText = "Title"
            floatingLabelText = "Title"
            type = "text"
            value = {this.state.title}
            onChange={(event) => this.onChangeTitle(event)}
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
              label="Create Doc" primary={true}  />
            </div>



          </div>
        );
      }
    }

    export default CreateDoc;
