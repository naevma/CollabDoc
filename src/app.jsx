import React from 'react';
import {Editor, EditorState} from 'draft-js';

import Draft from './component/draft';

export default class App extends React.Component {

  render() {
    return (
      <div id="content">
        <Draft />
      </div>
    );
  }
}
