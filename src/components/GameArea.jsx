import '../stylesheets/components/game-area.less';

import React from 'react';

import Card from "./Card";
import $game from '../service/GameService';
import ArrayUtils from "../util/ArrayUtils";

export default class GameArea extends React.Component {

    constructor (props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.renderCard = this.renderCard.bind(this);
    }

    createRenderCardFunction (row) {
        return (_, column) => this.renderCard(column, row);
    }

    renderCard (column, row) {
        return <Card key={`${column},${row}`} row={column} column={row} />;
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
            <div id="game-area">
                {ArrayUtils.createEmptyArray($game.TOTAL_ROWS).map(this.renderRow)}
            </div>
        );
    }
}