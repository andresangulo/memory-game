import '../stylesheets/components/controls.less';

import React from 'react';
import $game from "../service/GameService";

export default class Controls extends React.PureComponent {

    constructor (props) {
        super(props);

        this.confirmEndGame = this.confirmEndGame.bind(this);
        this.confirmRestartGame = this.confirmRestartGame.bind(this);
    }

    confirmEndGame () {
        if (confirm('Would you like to end the current game and boot all players?')) {
            $game.end();
        }
    }

    confirmRestartGame () {
        if (confirm('Would you like to reshuffle all cards and start again?')) {
            $game.restart();
        }
    }

    render () {
        return (
            <div id="controls">
                <a onClick={this.confirmEndGame}>End game</a>
                <a onClick={this.confirmRestartGame}>Reshuffle and restart game</a>
            </div>
        );
    }
}