import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import {Transition, PathResolver} from './Tools/Transition'
import Framework from './Tools/Framework'

import Main from './Pages/Main'

const path = {
  'index' : Main
}

PathResolver(path);

serviceWorker.unregister();