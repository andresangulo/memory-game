import '../stylesheets/components/game-area.less';

import React from 'react';

import Card from "./Card";
import $game from '../service/GameService';

export default class GameArea extends React.Component {

    constructor (props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderCard = this.renderCard.bind(this);
    }

    createEmptyArray (length) {
        const array = [];
        for (let index = 0; index < length; index++) {
            array.push(index);
        }

        return array;
    }

    createRenderCardFunction (row) {
        return (_, column) => this.renderCard(row, column);
    }

    renderCard (row, column) {
        return <Card key={'' + column} row={row} column={column} />;
    }

    renderRow (_, row) {
        return (
            <div key={'' + row} className={'row'}>
                {this.createEmptyArray($game.TOTAL_COLUMNS).map(this.createRenderCardFunction(row))}
            </div>
        );
    }

    render () {
        return (
            <div id="game-area">
                {this.createEmptyArray($game.TOTAL_ROWS).map(this.renderRow)}
            </div>
        );
    }
}