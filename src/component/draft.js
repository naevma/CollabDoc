import React from 'react';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import DropDown from 'material-ui/DropDownMenu';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand=this.handleKeyCommand.bind(this);
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
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

  _toggleColor(toggledColor) {
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    const nextContentState = Object.keys(colorStyleMap)
    .reduce((contentState, color) => {
      return Modifier.removeInlineStyle(contentState, selection, color)
    }, editorState.getCurrentContent());

    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    if(selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) => {
        return RichUtils.toggleInlineStyle(state, color);
      }, nextEditorState);
    }

    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor
      );
    }

    this.onChange(nextEditorState);
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
    const {editorState} = this.state;
    return (
      <div>
      <div id="content">
        <h1>Draft.js Editor</h1>
      </div>
      <div>
      <button>
        <i className="material-icons" onClick={this._onBoldClick.bind(this)}>format_bold</i>
      </button>
      <button>
        <i className="material-icons" onClick={this._onItalicsClick.bind(this)}>format_italic</i>
      </button>
      <button>
        <i className="material-icons" onClick={this._onUnderlineClick.bind(this)}>format_underlined</i>
      </button>
      <div style = {styles.root}>
        <DropDown>
            <ColorControls
              editorState={editorState}
              onToggle={this.toggleColor}
            />
          </DropDown>
          <div style={styles.editor} onClick={this.focus}>
                 <Editor
                    customStyleMap={colorStyleMap}
                   editorState={editorState}
                   onChange={this.onChange}
                   ref={(ref) => this.editor = ref}
                 />
          </div>
      </div>
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

// class ColorEditor extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {editorState: EditorState.createEmpty()}
//     this.focus = () => this.editor.focus();
//     this.onChange = (editorState) => this.setState({editorState});
//     this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
//   }
//
//   _toggleColor(toggledColor) {
//     const {editorState} = this.state;
//     const selection = editorState.getSelection();
//
//
//     const nextContentState = Object.keys(colorStyleMap)
//     .reduce((contentState, color) => {
//       return Modifier.removeInlineStyle(contentState, selection, color)
//     }, editorState.getCurrentContent());
//
//     let nextEditorState = EditorState.push(
//       editorState,
//       nextContentState,
//       'change-inline-style'
//     );
//
//     const currentStyle = editorState.getCurrentInlineStyle();
//
//     if(selection.isCollapsed()) {
//       nextEditorState = currentStyle.reduce((state, color) => {
//         return RichUtils.toggleInlineStyle(state, color);
//       }, nextEditorState);
//     }
//
//     if (!currentStyle.has(toggledColor)) {
//       nextEditorState = RichUtils.toggleInlineStyle(
//         nextEditorState,
//         toggledColor
//       );
//     }
//
//     this.onChange(nextEditorState);
//   }
//
//     render() {
//       const {editorState} = this.state
//       return (
//     <div style = {styles.root}>
//           <ColorControls
//             editorState={editorState}
//             onToggle={this.toggleColor}
//           />
//         <div style={styles.editor} onClick={this.focus}>
//                <Editor
//                   customStyleMap={colorStyleMap}
//                  editorState={editorState}
//                  onChange={this.onChange}
//                  ref={(ref) => this.editor = ref}
//                />
//         </div>
//     </div>
//       );
//     }
//   }

  class StyleButton extends React.Component {
          constructor(props) {
            super(props);
            this.onToggle = (e) => {
              e.preventDefault();
              this.props.onToggle(this.props.style);
            };
          }
          render() {
            let style;
            if (this.props.active) {
              style = {...styles.styleButton, ...colorStyleMap[this.props.style]};
            } else {
              style = styles.styleButton;
            }
            return (
              <span style={style} onMouseDown={this.onToggle}>
                {this.props.label}
              </span>
            );
          }
        }
        var COLORS = [
          {label: 'Red', style: 'red'},
          {label: 'Orange', style: 'orange'},
          {label: 'Yellow', style: 'yellow'},
          {label: 'Green', style: 'green'},
          {label: 'Blue', style: 'blue'},
          {label: 'Indigo', style: 'indigo'},
          {label: 'Violet', style: 'violet'},
        ];
        const ColorControls = (props) => {
          var currentStyle = props.editorState.getCurrentInlineStyle();
          return (
            <div style={styles.controls}>
              {COLORS.map(type =>
                <StyleButton
                  active={currentStyle.has(type.style)}
                  label={type.label}
                  onToggle={props.onToggle}
                  style={type.style}
                />
              )}
            </div>
          );
        };
        // This object provides the styling information for our custom color
        // styles.
        const colorStyleMap = {
          red: {
            color: 'rgba(255, 0, 0, 1.0)',
          },
          orange: {
            color: 'rgba(255, 127, 0, 1.0)',
          },
          yellow: {
            color: 'rgba(180, 180, 0, 1.0)',
          },
          green: {
            color: 'rgba(0, 180, 0, 1.0)',
          },
          blue: {
            color: 'rgba(0, 0, 255, 1.0)',
          },
          indigo: {
            color: 'rgba(75, 0, 130, 1.0)',
          },
          violet: {
            color: 'rgba(127, 0, 255, 1.0)',
          },
        };
        const styles = {
          root: {
            fontFamily: '\'Georgia\', serif',
            fontSize: 14,
            padding: 20,
            width: 600,
          },
          editor: {
            borderTop: '1px solid #ddd',
            cursor: 'text',
            fontSize: 16,
            marginTop: 20,
            minHeight: 400,
            paddingTop: 20,
          },
          controls: {
            fontFamily: '\'Helvetica\', sans-serif',
            fontSize: 14,
            marginBottom: 10,
            userSelect: 'none',
          },
          styleButton: {
            color: '#999',
            cursor: 'pointer',
            marginRight: 16,
            padding: '2px 0',
          },
        };



export default Draft;
