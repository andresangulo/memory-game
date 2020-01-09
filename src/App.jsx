import './stylesheets/app.less';

import React from 'react';
import {render} from 'react-dom';

import Game from './components/Game';

class App extends React.Component {
    render () {
        return (
            <div id='main'>
                <Game />
            </div>
        );
    }
}

render(<App/>, document.getElementById('app'));