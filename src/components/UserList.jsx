import '../stylesheets/components/user-list.less';

import React from 'react';

import {observer} from "mobx-react";
import {find, uniq} from 'lodash';

import $game from '../service/GameService';

@observer
export default class UserList extends React.PureComponent {

    constructor (props) {
        super(props);

        this.renderUser = this.renderUser.bind(this);
        this.renderMatch = this.renderMatch.bind(this);
    }

    getMatches (username) {
        return uniq($game.cards.filter(card => card.resolvedBy === username).map(card => card.group));
    }

    createConfirmBootUserFunction (username) {
        return () => this.confirmBootUser(username);
    }

    confirmBootUser (username) {
        let message = 'Are you sure you want to boot this user from the game?';
        if ($game.users.length === 1) {
            message += ' This will destroy the game.';
        }

        if (confirm(message)) {
            $game.bootUser(username);
        }
    }

    renderMatch (group) {
        const card = find($game.cards, {group});
        if (!card) {
            return null;
        }

        return <i key={group} className={`match fa fa-fw fa-${card.symbol}`} style={{color: card.color}} />;
    }

    renderMatches (username) {
        const matches = this.getMatches(username);
        if (!matches || !matches.length) {
            return null;
        }

        return <span className={'matches'}>{matches.map(this.renderMatch)}</span>;
    }

    renderUser (username) {
        const active = (username === $game.currentUsername);
        return (
            <a key={username} className={'user' + (active ? ' active' : '')} onClick={this.createConfirmBootUserFunction(username)}>
                <span className={'name'}><i className={'fa fa-user'} /> {username}</span>
                {this.renderMatches(username)}
            </a>
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