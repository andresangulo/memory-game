import '../stylesheets/components/user-list.less';

import React from 'react';

import $game from '../service/GameService';

export default class UserList extends React.PureComponent {

    state = {
        loaded: false,
        users: []
    };

    constructor (props) {
        super(props);

        this.renderUser = this.renderUser.bind(this);
    }

    componentDidMount () {
        this.loadUsers();
    }

    async loadUsers () {
        this.setState({loaded: false, users: []});
        const users = await $game.getUserList();
        this.setState({loaded: true, users})
    }

    renderUser (username) {
        return (
            <span key={username} className={'user'}>
                <i className={'fa fa-user'} /> {username}
            </span>
        );
    }

    renderUsers () {
        if (!this.state.loaded) {
            return (
                <span className={'loading'}>
                    <i className={'fa fa-spin fa-refresh'} /> Loading
                </span>
            )
        }

        return (
            <div className={'users'}>
                {this.state.users.map(this.renderUser)}
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