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

  onChangeDocID = (e) => {
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

}

  render() {
    return (
      <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>

        <div>
          <TextField
            hintText="Title"
            onChange={() => this.onChangeDocID(event)}
          />

        </div>

        <div><TextField
          hintText="Password"
          onChange={() => this.onChangePassword(event)}

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
