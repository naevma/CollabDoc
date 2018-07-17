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
      password:''
    }
  }

  onChangeDocID(e){
    this.setState({
      documentID: e.target.value
    })
  }

  onChangePassword(e){
    this.setState({
      password: e.target.value
    })
  }

onClick(){

}

  render() {
    return (
      <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>

        <div>
          <TextField
            hintText="Document ID"
            onChange={this.onChangeDocID.bind(this)}
          />

        </div>

        <div><TextField
          hintText="Password"
          onChange={this.onChangePassword.bind(this)}

        /></div>
        <div
          style={{ textAlign: 'center'}}
          >

            <RaisedButton
              onClick={this.onClick.bind(this)}
              label="Add Doc" primary={true}  />
            </div>



          </div>
        );
      }
    }

    export default AddDoc;
