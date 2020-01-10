import '../stylesheets/components/game-area.less';

import React from 'react';

import Card from "./Card";
import $game from '../service/GameService';
import ArrayUtils from "../util/ArrayUtils";
import {observer} from "mobx-react";
import {reaction} from "mobx";

@observer

export default class GameArea extends React.Component {

    removeCardSynchroniser;

    constructor (props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderCard = this.renderCard.bind(this);
    }

    componentDidMount () {
        this.removeCardSynchroniser = reaction(() => JSON.stringify($game.cards), () => this.setState({}));
    }

    componentWillUnmount () {
        this.removeCardSynchroniser();
    }


    createRenderCardFunction (row) {
        return (_, column) => this.renderCard(row, column);
    }

    renderCard (row, column) {
        return <Card key={`${column},${row}`} row={row} column={column} card={$game.getCard(row, column)} />;
    }

    renderRow (_, row) {
        return (
            <div key={row.toString()} className={'row'}>
                {ArrayUtils.createEmptyArray($game.TOTAL_COLUMNS).map(this.createRenderCardFunction(row))}
            </div>
        );
    }

    render () {
        return (
            <div id="game-area" className={$game.ownTurn ? 'own-turn' : ''}>
                {$game.ready && ArrayUtils.createEmptyArray($game.TOTAL_ROWS).map(this.renderRow)}
            </div>
        );
    }
}