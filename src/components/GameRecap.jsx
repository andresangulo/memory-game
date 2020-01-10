import '../stylesheets/components/game-recap.less';

import React from 'react';
import $game from "../service/GameService";
import pluralize from 'pluralize';
import {observer} from "mobx-react";

@observer
export default class GameRecap extends React.Component {

    countMatchesForUser (username) {
        let matches = 0;
        $game.matches.forEach(group => {
            $game.cards.filter(card => {
                if (card.group === group && card.resolvedBy === username) {
                    matches++;
                }
            });
        });

        return matches / 2;
    }

    getWinnerInformation () {
        let users = {};
        let currentMax = 0;
        $game.users.forEach(username => {
            const matches = this.countMatchesForUser(username);
            currentMax = Math.max(matches, currentMax);
            if (!users[matches]) {
                users[matches] = [];
            }

            users[matches].push(username);
        });

        return {matches: currentMax, winningUsers: users[currentMax]};
    }

    renderWinner (users, matches) {
        let text;
        if (users.length === 1) {
            text = users[0] + ' wins';
        } else if (users.length === 2) {
            text = users[0] + ' and ' + users[1] + ' tie';
        } else {
            text = users.slice(0, users.length - 1).join(', ') + ' and ' + users[users.length - 1] + ' tie';
        }

        text += ' with ' + matches + ' ' + pluralize('match', matches);
        return <span>{text}</span>
    }

    render () {
        if ($game.matches.length < $game.TOTAL_MATCHES) {
            return null;
        }

        const {matches, winningUsers} = this.getWinnerInformation();
        return (
            <div id="game-recap">
                <i className={'fa fa-star'} />
                <h1>Game finished</h1>
                {this.renderWinner(winningUsers, matches)}
            </div>
        );
    }
}