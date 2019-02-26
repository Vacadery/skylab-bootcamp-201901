import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';

import spotifyApi from './spotify-api'

spotifyApi.token = 'BQAMr0HgALW-pbbd-42dgtFfy0xIKalFTwN7JLTJZEQLjFBIIEt8CS-LzpjprvcQuCbUCdWnl1ArkFmF5Yslw_Ob5Crt58th-LJ_l6D_WkumPir2dbYpUhvUdYPjInBqjh7U06ysTWg7'

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
