import '../stylesheets/components/session-information.less';

import React from 'react';

import $game from '../service/GameService';
import {observer} from "mobx-react";

@observer
export default class SessionInformation extends React.PureComponent {

    constructor (props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout () {
        $game.logout();
    }

    render () {
        let turnText;
        if ($game.ownTurn) {
            turnText = <b>and it is your turn</b>;
        } else {
            turnText = $game.currentUsername + ' is playing their turn';
        }

        return (
            <div id="session-information">
                <span>Logged in as <span className={'username'}>{$game.username}</span>, {turnText}</span>
                <a onClick={this.logout} className={'log-out'}>Log out <i className={'fa fa-sign-out'} /></a>
            </div>
        );
    }

}