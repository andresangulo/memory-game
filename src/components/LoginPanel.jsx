import '../stylesheets/components/login-panel.less';

import React from 'react';

import $game from '../service/GameService';

export default class LoginPanel extends React.Component {

    state = {
        loggingIn: false,
        username: ''
    };

    constructor (props) {
        super(props);

        this.handleUserInputChange = this.handleUserInputChange.bind(this);
        this.login = this.login.bind(this);
    }

    handleUserInputChange (event) {
        this.setUsername(event.target.value);
    }

    setUsername (username) {
        this.setState({username: username.toLowerCase()});
    }

    async login (event) {
        event && event.preventDefault();
        this.setState({loggingIn: true});
        await $game.login(this.state.username);
    }

    render () {
        return (
            <form id="login-panel" onSubmit={this.login}>
                <h2>Log in</h2>
                <span>Enter a username to join the game</span>
                <input type="text" value={this.state.username} onChange={this.handleUserInputChange} placeholder={'Username'} disabled={this.state.loggingIn} />
                <button type={'submit'} disabled={!this.state.username || !this.state.username.trim().length || this.state.loggingIn}>
                    {this.state.loggingIn ? 'Logging in...' : 'Log in'}
                </button>
            </form>
        );
    }
}