import React from 'react';
import {Editor, EditorState, DefaultDraftBlockRenderMap, RichUtils, ContentState, convertToRaw, convertFromRaw, Modifier, CompositeDecorator} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import _ from 'underscore';
import io from 'socket.io-client'


class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentPage: 'draft',
      online: [],
      title: 'Untitled Doc',
      contentHistory: [],
      saved: false,
      collaborators: [],
      currentDocument: {},
      autosave: false,
      online: [],
      historyArr: [],
      search: '',
      highlightStart: 0,
      highlightStop:0
    };
    // this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand=this.handleKeyCommand.bind(this);
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);
    this.previousHighlight = null;
    this.interval = setInterval(this._onSave.bind(this), 10000);
  }


  onChange = (editorState) => {
    const {socket} = this.props
    this.setState({editorState}, () => {
      socket.emit('syncDocument', {
        _id: this.props.id,
        rawState: convertToRaw(editorState.getCurrentContent()),
      });
    })
    const selection = editorState.getSelection();
    console.log('highlight', selection.anchorOffset, selection.focusOffset)


    this.setState({highlightStart: selection.anchorOffset, highlightStop: selection.focusOffset}, () => {
      socket.emit('highlight', {
        _id: this.props.id,
        start: selection.anchorOffset,
        stop: selection.focusOffset
      })
    })

    socket.on('receiveNewCursor', (data) => {
      if (selection.anchorOffset === selection.focusOffset) {
        const windowSelection = window.getSelection();
        if (windowSelection.rangeCount>0) {
          var ranges = [];
          var clientRects;
          for (var i = 0; i < windowSelection.rangeCount; i++) {
            ranges[i] = windowSelection.getRangeAt(i);
            clientRects = ranges[i].getClientRects();
        }
          console.log('clientRects', clientRects)
          if (clientRects.length >0) {
            const rects = clientRects[0];
            console.log('location', rects);
            const {top, left, bottom} = rects
            const loc = {top: rects.top, bottom: rects.bottom, left: rects.left}
            var data = {incomingSelectionObj: selection, loc: loc}
            console.log('data', data)
            socket.emit('cursorMove', data)
          }
        }
      }
      // console.log('in receive of cursor mvoemnt');
      const incomingSelectionObj = data.incomingSelectionObj
      const loc = data.loc
      let editorState = this.state.editorState;
      const originalEditorState = editorState;
      const originalSelection = this.state.editorState.getSelection();
      //take the original selection stateand change all its values to be the selectionstateobj  that we just received
      const incomingSelectionState = originalSelection.merge(incomingSelectionObj)
      const temporaryEditorState = EditorState.forceSelection(originalEditorState, incomingSelectionState)

      if(temporaryEditorState) {
        this.setState({editorState: temporaryEditorState}, function() {
          //were now referring to browser selectionstateobjc
          if(loc && loc.top && loc.bottom && loc.left) {
            this.setState({editorState: originalEditorState, top: loc.top, left: loc.left, height: loc.bottom - loc.top})
          }
        })
      } else {
        console.log('temportaray state undefined wtf');
      }
    })
  }


  componentWillUnmount() {
    this.socket.emit('disconnect');
    this.socket.close();
    clearInterval(this.interval);
  }

  SearchHighlight = (props) => (
  <span className="search-highlight">{props.children}</span>
);

generateDecorator = (highlightTerm) => {
  const regex = new RegExp(highlightTerm, 'g');
  return new CompositeDecorator([{
    strategy: (contentBlock, callback) => {
      if (highlightTerm !== '') {
        this.findWithRegex(regex, contentBlock, callback);
      }
    },
    component: this.SearchHighlight,
  }])
};

findWithRegex = (regex, contentBlock, callback) => {
const text = contentBlock.getText();
let matchArr, start, end;
while ((matchArr = regex.exec(text)) !== null) {
  start = matchArr.index;
  end = start + matchArr[0].length;
  callback(start, end);
}
};

onChangeSearch = (e) => {
  const search = e.target.value;
  this.setState({
    search,
    editorState: EditorState.set(this.state.editorState, { decorator: this.generateDecorator(search) }),
  });
}

  handleClick = event => {
    this.setState({anchorE1: event.currentTarget})
  }
  handleClose = () => {
    this.setState({anchorE1: null})
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

  _onLeftAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'left'));
  }

  _onCenterAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'center'));
  }

  _onRightAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'right'));
  }

  _onH1CLick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-one'));
  }

  _onH2CLick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-two'));
  }

  _onH3CLick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-three'));
  }
  _onH4CLick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-four'));
  }

  _onH5CLick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-five'));
  }

  _onH6CLick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'header-six'));
  }

  _onBulletListClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
  }

  _onNumberedListClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
  }

  _onCenterAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'center'));
  }

  _onRightAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'right'));
  }

  _onLeftAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'left'));
  }

  _toggleColor(toggledColor) {
    const {editorState} = this.state.editorState;
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

  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'left') {
      return 'align-left';
    }
    if (type === 'center') {
      return 'align-center';
    }
    if (type === 'right') {
      return 'align-right';
    }
  }

  _onSave() {
    // var newContent = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
    var contentState = convertToRaw(this.state.editorState.getCurrentContent());
    var newContentHistory = this.state.contentHistory.slice();
    newContentHistory.push(contentState);
    this.setState({contentHistory: newContentHistory}, () => {
      // this.socket.emit('newContentHistory', this.state.contentHistory)
    })
    var newTitle = this.state.title;
    var rawContent = this.state.editorState.getCurrentContent();
    //var currentDocument = Object.assign({}, {content: rawContent})
    // var array1=this.state.historyArr.slice();
    // array1.push(contentState);
    this.setState({saved: true, title: newTitle, editorState: EditorState.createWithContent(rawContent)}, () => {
      console.log('fuckingwork',this.state.historyArr)
      console.log('editor', this.state.editorState)
    })

    fetch('http://697b5db9.ngrok.io/savedoc', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({
        documentID: this.props.id,
        editorState: contentState,
        saveDates: new Date()
      })
    })
    .then((response) => {
      console.log("response", response)
      if (response.status === 200) {
        return response.json()
      }
      else {
        console.log("error");
      }
    })
    .then((resp) => {
      console.log(resp.success);
    })
    // .then((responseJson) => {
    //   console.log('response 2', responseJson)
    //   if (responseJson.success){
    //     this.props.redirect('Content')
    //   }
    //   else {
    //     console.log("ERROR", responseJson.error)
    //   }
    // })
    .catch((err) => {
      console.log("ANOTHA ERR", err)
      /* do something if there was an error with fetching */
    });
  }

  viewChanges = (index) => {
    console.log("HISTORY", this.state.historyArr);
    var arr= this.state.historyArr.slice()
    var specificIndex = arr[index]
    if (typeof specificIndex === "string") {
      specificIndex = JSON.parse(specificIndex);
    }
    if (specificIndex.entityMap == null) {
      specificIndex.entityMap = {};
    }
  console.log("xxxxx", specificIndex)
    this.setState({
      editorState: EditorState.createWithContent(convertFromRaw(specificIndex))
    })
  }

  viewHistory = () => {

  }

  onTitleEdit(event) {
    this.setState({saved: false, title: event.target.value})
    console.log(this.state.title)
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled'
  }

  componentDidMount() {

    const {socket} = this.props
    socket.emit('openDoc', {
      _id: this.props.id
    })
    console.log("this.props.save", this.props.saveDates)
    socket.on('syncDocument', this.remoteStateChange)
    socket.on('highlight', this.remoteStateChangeHigh)

    console.log("contentHistory", this.props.contentHistory)
    if (this.props.contentHistory.length) {
      console.log("contentHistory1", "hi")

      var newArr = this.props.contentHistory.slice();


      // for(var i=0; i<newArr.length;i++){
      //   allDocs.push(EditorState.createWithContent(convertFromRaw(newArr[i])))
      // }


      let lastDoc = newArr[newArr.length - 1];

      if (typeof lastDoc === "string") {
        lastDoc = JSON.parse(lastDoc);
      }
      if (lastDoc.entityMap == null) {
        lastDoc.entityMap = {};
      }
      console.log(newArr)
      this.setState({
        contentHistory: this.props.contentHistory,
        editorState: EditorState.createWithContent(convertFromRaw(lastDoc)),
        historyArr:  newArr
      })
    }
  }

  remoteStateChange = (res) => {
    console.log('whatsupppp')
    this.setState({editorState: EditorState.createWithContent(convertFromRaw(res.rawState))})
  }

  remoteStateChangeHigh = (res) => {
    console.log('high', res)
    this.setState({highlightStart: res.start, highlightStop: res.stop}, () => {
      console.log(this.state.highlightStart, this.state.highlightStop)
    })
  }

  render() {
    const {editorState} = this.state;
    return (
      <MuiThemeProvider muiTheme={muiTheme} >
      <div>
        <AppBar title={this.props.title} onLeftIconButtonClick = {this.handleToggle} />
        <Drawer
          docked = {false}
          width = {200}
          open = {this.state.open}
          onRequestChange = {(open) => this.setState({open})}>

          <AppBar title = "Menu" showMenuIconButton={false} />
        </Drawer>
        <div style = {{padding: '5%'}}>
          <TextField id="read-only-input"
            value= {this.props.id}
            />
          <div>
            <TextField
              hintText="Find in document"
              onChange={this.onChangeSearch} />
          </div>
          <div style={{border: '1px solid black', paddingBottom: 10}}>
            <div style={styles.toolbar}>
            <div style = {{display: 'inline-block', position: 'relative', top: '11px'}}>
            <SelectField
              hintText="Font Size" style={styles.textSizeField}
              dropDownMenuProps={{
                iconButton:<i className="material-icons">arrow_drop_down</i>
              }}>
              <MenuItem onClick={this._onH1CLick.bind(this)}>H1</MenuItem>
              <MenuItem onClick={this._onH2CLick.bind(this)}>H2</MenuItem>
              <MenuItem onClick={this._onH3CLick.bind(this)}>H3</MenuItem>
              <MenuItem onClick={this._onH4CLick.bind(this)}>H4</MenuItem>
              <MenuItem onClick={this._onH5CLick.bind(this)}>H5</MenuItem>
              <MenuItem onClick={this._onH6CLick.bind(this)}>H6</MenuItem>
            </SelectField>

            <SelectField
              hintText="Font Color" style={styles.fontColorField}
              dropDownMenuProps={{
                iconButton: <i className="material-icons" style={{paddingRight: 10}}>arrow_drop_down</i>
              }}>
              <ColorControls
                editorState={editorState}
                onToggle={this.toggleColor}
              />
            </SelectField>
            </div>
              <button>
                <i className="material-icons" onClick={this._onBoldClick.bind(this)}>format_bold</i>
              </button>
              <button>
                <i className="material-icons" onClick={this._onItalicsClick.bind(this)}>format_italic</i>
              </button>
              <button>
                <i className="material-icons" onClick={this._onUnderlineClick.bind(this)}>format_underlined</i>
              </button>
              <button>
                <i className="material-icons" onClick={this._onBulletListClick.bind(this)}>format_list_bulleted</i>
              </button>
              <button>
                <i className="material-icons" onClick={this._onNumberedListClick.bind(this)}>format_list_numbered</i>
              </button>

              <button>
                <i className="material-icons" onClick={this._onLeftAlignClick.bind(this)}>format_align_left</i>
              </button>

              <button>
                <i className="material-icons" onClick={this._onCenterAlignClick.bind(this)}>format_align_center</i>
              </button>

              <button>
                <i className="material-icons" onClick={this._onRightAlignClick.bind(this)}>format_align_right</i>
              </button>
            </div>
            <div className="editor" style={styles.editor} onClick={this.focus}>
              <Editor
                customStyleMap={colorStyleMap}
                editorState={editorState}
                onChange={this.onChange}
                textAlignment={'right'}
                blockStyleFn = {this.myBlockStyleFn}
                ref={(ref) => this.editor = ref}
              />
            </div>
            <div style={{paddingLeft: 10}}>
              <RaisedButton
                label={this.state.saved ? "Saved" : "Save"}
                onClick= {this._onSave.bind(this)}
                style={{marginRight: 10}}>
              </RaisedButton>
              <RaisedButton
                label= "View History"
                onClick = {() => this.viewHistory()}>
                </RaisedButton>
              </div>
            </div>

          {/* <List>
            {this.state.historyArr.map((save, index) =>
            <ListItem
            key = {index}
            leftAvatar={<Avatar icon={<ActionAssignment />} backgroundColor={blue500}/>}
            primaryText = {save.title}
            secondaryText = {new Date(doc.created).toString().slice(0,15)}
          />)}
        </List>} */}
        {this.props.saveDates.map((save, index) => <RaisedButton onClick = {() => this.viewChanges(index)} key = {index} label={new Date(save).toString().slice(0,15)}></RaisedButton>
        )}
      </div>
      </div>
        </MuiThemeProvider>
    );
  }
}

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
        <div>
          <RaisedButton style={{boxShadow: '0px 0px 0px'}}>
            <StyleButton
              active={currentStyle.has(type.style)}
              label={type.label}
              onToggle={props.onToggle}
              style={type.style}
            />
          </RaisedButton>
        </div>
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
  toolbar: {
    borderBottom: '1px solid grey',
    paddingLeft: 10,
    display: 'flex',
    alignItems: 'center'
  },
  editor: {
    cursor: 'text',
    height: '100%',
    width: '100%',
    fontSize: 16,
    marginTop: 20,
    minHeight: 400,
    paddingTop: 20,
  },
  controls: {
    fontFamily: '\'Helvetica\', sans-serif',
    fontSize: 14,
    userSelect: 'none',
  },
  styleButton: {
    color: 'black'
  },
  textSizeField: {
    width: 100,
    height: 45,
    position: 'relative'
  },
  fontColorField: {
    width: 110,
    height: 45,
    position: 'relative',
    paddingLeft: 5
  }
};

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
});

export default Draft;
