import '../stylesheets/components/move-history.less';

import React from 'react';
import $game from "../service/GameService";
import {observer} from "mobx-react";
import {find} from 'lodash';

@observer
export default class MoveHistory extends React.Component {

    constructor (props) {
        super(props);

        this.renderMove = this.renderMove.bind(this);
    }

    createPromptToRevertFunction (group) {
        return () => {
            if (confirm('Are you sure you want to revert to the point before this match was made?')) {
                $game.revert(group);
            }
        }
    }

    renderMove (group) {
        const card = find($game.cards, {group});
        if (!card || typeof card.resolvedBy !== 'string') {
            return null;
        }

        return (
            <span key={group.toString()} className={'move'} onClick={this.createPromptToRevertFunction(group)} title={'Revert to before this match'}>
                <span className={'user'}>{card.resolvedBy}</span>
                <div className={'cards'}>
                    <span className={'card'} style={{backgroundColor: card.color}}>
                        <i className={`fa fa-fw fa-${card.symbol}`} />
                    </span>
                    <span className={'card'} style={{backgroundColor: card.color}}>
                        <i className={`fa fa-fw fa-${card.symbol}`} />
                    </span>
                </div>
            </span>
        );
    }

    renderMatches () {
        return (
            <div className={'matches'}>
                {$game.matches.map(this.renderMove)}
            </div>
        )
    }

    render () {
        return (
            <div id="move-history">
                <h3>Matches</h3>
                {this.renderMatches()}
            </div>
        );
    }
}