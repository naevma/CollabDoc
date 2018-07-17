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
    this.state={}
  }



onClick(){

}

  render() {
    return (
      <div style = {{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <List>
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
