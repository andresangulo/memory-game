import '../stylesheets/components/game.less';

import React from 'react';

import LoginPanel from "./LoginPanel";
import GameArea from "./GameArea";
import MoveHistory from "./MoveHistory";
import SessionInformation from "./SessionInformation";

import $game from '../service/GameService';
import UserList from "./UserList";
import {observer} from "mobx-react";

@observer
export default class Game extends React.Component {

    render () {
        if ($game.loading) {
            return (
                <span>
                    <i className={'fa fa-spin fa-refresh'} /> Loading, please wait...
                </span>
            );
        } else if (!$game.loggedIn) {
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