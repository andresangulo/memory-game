import '../stylesheets/components/user-list.less';

import React from 'react';

import $game from '../service/GameService';
import {observer} from "mobx-react";

@observer
export default class UserList extends React.PureComponent {

    constructor (props) {
        super(props);

        this.renderUser = this.renderUser.bind(this);
    }

    renderUser (username) {
        return (
            <span key={username} className={'user'}>
                <i className={'fa fa-user'} /> {username}
            </span>
        );
    }

    renderUsers () {
        return (
            <div className={'users'}>
                {$game.users.map(this.renderUser)}
            </div>
        )
    }

    render () {
        return (
            <div id="user-list">
                <h3>Users</h3>
                {this.renderUsers()}
            </div>
        );
    }
}