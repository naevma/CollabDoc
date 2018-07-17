import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';


class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand=this.handleKeyCommand.bind(this);
  }

  _onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalicsClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled'
  }


  render() {
    return (
      <div>
      <div id="content">
        <h1>Draft.js Editor</h1>
      </div>
      <div>
      <RaisedButton
        onClick={this._onBoldClick.bind(this)}>BOLD
      </RaisedButton>
        <button onClick={this._onItalicsClick.bind(this)}>ITALICS</button>
        <button onClick={this._onUnderlineClick.bind(this)}>UNDERLINE</button>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand ={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
      </div>
    );
  }
}

export default Draft;
