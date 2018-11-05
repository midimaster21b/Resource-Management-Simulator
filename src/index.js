import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// import {Resource, ResourceList} from './Resource';
// import {Process, ProcessCell, ProcessList} from './ProcessResource';
import {ResourceManager} from './ResourceManager';

ReactDOM.render(<ResourceManager />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
