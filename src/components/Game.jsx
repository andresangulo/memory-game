import '../stylesheets/components/game.less';

import React from 'react';

import LoginPanel from "./LoginPanel";
import GameArea from "./GameArea";
import MoveHistory from "./MoveHistory";
import SessionInformation from "./SessionInformation";

import $game from '../service/GameService';
import UserList from "./UserList";

export default class Game extends React.Component {

    state = {
        loggedIn: false
    };

    constructor (props) {
        super(props);

        this.setLoggedIn = this.setLoggedIn.bind(this);
        this.setLoggedOut = this.setLoggedOut.bind(this);
    }

    componentDidMount () {
        $game.on('logged-in', this.setLoggedIn);
        $game.on('logged-out', this.setLoggedOut);
    }

    componentWillUnmount () {
        $game.removeListener('logged-in', this.setLoggedIn);
        $game.removeListener('logged-out', this.setLoggedOut);
    }

    setLoggedIn () {
        this.setState({loggedIn: true});
    }

    setLoggedOut () {
        this.setState({loggedIn: false});
    }

    render () {
        if (!this.state.loggedIn) {
            return <LoginPanel />;
        }

        return (
            <div id='game'>
                <h1>
                    <i className={'fa fa-cloud cloud'} /> Memory game <i className={'fa fa-cloud cloud'} />
                </h1>
                <SessionInformation />
                <div style={{display: 'block', marginTop: '20px'}}>
                    <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                        <GameArea />
                    </div>
                    <div style={{display: 'inline-block', marginLeft: '20px', verticalAlign: 'top'}}>
                        <UserList />
                        <MoveHistory />
                    </div>
                </div>
            </div>
        );
    }
}