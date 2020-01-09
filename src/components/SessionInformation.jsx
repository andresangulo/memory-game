import '../stylesheets/components/session-information.less';

import React from 'react';

import $game from '../service/GameService';

export default class SessionInformation extends React.PureComponent {

    constructor (props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout () {
        $game.logout();
    }

    render () {
        return (
            <div id="session-information">
                <span>Logged in as <span className={'username'}>{$game.username}</span></span>
                <a onClick={this.logout} className={'log-out'}>Log out <i className={'fa fa-sign-out'} /></a>
            </div>
        );
    }

}