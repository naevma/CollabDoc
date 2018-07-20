import React from 'react';
import {Editor, EditorState, DefaultDraftBlockRenderMap, RichUtils, ContentState, convertToRaw, convertFromRaw, Modifier, CompositeDecorator} from 'draft-js';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import {List, ListItem} from 'material-ui/List';
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
      contentHistory: [],
      search: '',
      saveHistory: false,
      saveDates: props.saveDates
    };
    // this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand=this.handleKeyCommand.bind(this);
    this.toggleColor = (toggledColor) => this._toggleColor(toggledColor);

  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    })
  }

  autoSave() {
    setInterval(this.onSave.bind(this), 30000);
    this.setState({autosave: !this.state.autosave})
  }

  onChange = (editorState) => {

    const {socket} = this.props
    this.setState({editorState, saved: false}, () => {
      socket.emit('syncDocument', {
        _id: this.props.id,
        rawState: convertToRaw(editorState.getCurrentContent()),
      });
    })
  }
  //
  // componentWillUnmount() {
  //   this.socket.emit('disconnect');
  //   this.socket.disconnect();
  // }

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
    const date = new Date()
    var contentState = convertToRaw(this.state.editorState.getCurrentContent());
    var newContentHistory = this.state.contentHistory.slice();
    newContentHistory.push(contentState);
    var newTitle = this.state.title;
    var rawContent = this.state.editorState.getCurrentContent();
    let saveDates = [...this.state.saveDates, date]
    this.setState({saveDates, contentHistory: newContentHistory, saved: true, title: newTitle, editorState: EditorState.createWithContent(rawContent)}, () => {
      // this.socket.emit('newContentHistory', this.state.contentHistory)
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
        saveDates: date
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
      console.log("resP", resp)

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
    console.log("HISTORY", this.state.contentHistory);
    var arr = this.state.contentHistory.slice()
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
    this.setState({
      saveHistory: !this.state.saveHistory
    })
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

  finishChanges = () => {
    if (this.state.saved === false) {
      alert("Make sure you save first before you finish changes")
    }
    else {
      this.props.redirect('Content')
    }
  }

  componentDidMount() {
    const {socket} = this.props
    socket.emit('openDoc', {
      _id: this.props.id
    })
    console.log("this.props.save", this.props.saveDates)
    socket.on('syncDocument', this.remoteStateChange)

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
        contentHistory: this.props.contentHistory.slice(),
        editorState: EditorState.createWithContent(convertFromRaw(lastDoc))
      })
    }
  }

  remoteStateChange = (res) => {
    console.log('whatsupppp')
    this.setState({editorState: EditorState.createWithContent(convertFromRaw(res.rawState))})
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

            <div className = "text-center">
            <AppBar title = "Menu" showMenuIconButton={false}/>
            <MenuItem onClick = {this.finishChanges}>Back</MenuItem>
            </div>
          </Drawer>

          {this.state.saveHistory === false ? <div className = "container">
            <div style = {{display: 'flex', flexDirection: 'row'}}>
              <div style = {{flex: 3}}>
                <TextField id="read-only-input"
                  value= {this.props.id}
                />
                <div>
                  <TextField
                    hintText="Find in document"
                    onChange={this.onChangeSearch} />
                  </div>

                  <div style={styles.toolbar}>
                    <div>
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
                          iconButton: <i className="material-icons">arrow_drop_down</i>
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
                  <div style={styles.editor} onClick={this.focus}>
                    <Editor
                      customStyleMap={colorStyleMap}
                      editorState={editorState}
                      onChange={this.onChange}
                      textAlignment={'right'}
                      blockStyleFn = {this.myBlockStyleFn}
                      ref={(ref) => this.editor = ref}
                    />
                  </div>
                  <RaisedButton
                    label={this.state.saved ? "Saved" : "Save"}
                    onClick= {this._onSave.bind(this)}>
                  </RaisedButton>
                  <RaisedButton
                    label= "View History"
                    onClick = {() => this.viewHistory()}>
                  </RaisedButton>
                  <RaisedButton
                    label= "Finish Changes"
                    onClick = {this.finishChanges}
                    style = {{float: 'right'}}>
                  </RaisedButton>
                </div>
              </div>
            </div> : <div className = "container">
              <div style = {{display: 'flex', flexDirection: 'row'}}>
                <div style = {{flex: 3}}>
                  <TextField id="read-only-input"
                    value= {this.props.id}
                  />
                  <div>
                    <TextField
                      hintText="Find in document"
                      onChange={this.onChangeSearch} />
                    </div>

                    <div style={styles.toolbar}>
                      <div>
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
                            iconButton: <i className="material-icons">arrow_drop_down</i>
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
                    <div style={styles.editor} onClick={this.focus}>
                      <Editor
                        customStyleMap = {colorStyleMap}
                        editorState = {editorState}
                        onChange = {this.onChange}
                        textAlignment={'right'}
                        blockStyleFn = {this.myBlockStyleFn}
                        ref={(ref) => this.editor = ref}
                      />
                    </div>
                    <RaisedButton
                      label={this.state.saved ? "Saved" : "Save"}
                      onClick= {this._onSave.bind(this)}>
                    </RaisedButton>
                    <RaisedButton
                      label= "View History"
                      onClick = {() => this.viewHistory()}>
                    </RaisedButton>
                    <RaisedButton
                      label= "Finish Changes"
                      onClick = {this.finishChanges}
                      style = {{float: 'right'}}>
                    </RaisedButton>
                  </div>
                  <div style = {{flex: 1, marginLeft: '3%'}}>
                    <div style = {{height: '96px'}}>
                      <h3 className = "text-center"> Save History </h3>
                    </div>
                    <div style = {{border: '3px solid teal', overflow: 'scroll', overflowX: 'hidden', padding: '2%', height: '80%'}}>
                      <List>
                        {this.state.saveDates.map((save, index) => <ListItem key = {index} primaryText= {"Save " + (index + 1)} secondaryText = {new Date(save).toString().slice(4,24)} onClick = {() => this.viewChanges(index)} />
                      )}
                    </List>
                  </div>
                </div>
              </div>
            </div>}

          </div>
        </MuiThemeProvider>
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
            <RaisedButton>
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
      borderColor: 'black',
      borderStyle: 'solid',
      borderWidth: '1px',
      paddingBottom: 20,
      height: 80,
      alignContent: 'center',
      justifyElements: 'center'
    },
    root: {
      fontFamily: '\'Georgia\', serif',
      fontSize: 14,
      padding: 20,
    },
    editor: {
      cursor: 'text',
      height: '100%',
      width: '100%',
      fontSize: 16,
      marginTop: 20,
      minHeight: '60%',
      paddingTop: 20,
    },
    controls: {
      fontFamily: '\'Helvetica\', sans-serif',
      fontSize: 14,
      marginBottom: 10,
      userSelect: 'none',
    },
    styleButton: {
      color: 'black',
      cursor: 'pointer',
      marginRight: 16,
      padding: '2px 0',
      marginTop: 20
    },
    textSizeField: {
      width: 100,
      height: 45
    },
    fontColorField: {
      width: 110,
      height: 45,
    }
  };

  const muiTheme = getMuiTheme({
    appBar: {
      height: 50,
    },
  });

  export default Draft;
