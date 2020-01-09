import '../stylesheets/components/card.less';

import React from 'react';
import PropTypes from 'prop-types';

import $game from '../service/GameService';
import {observer} from "mobx-react";
import {reaction, toJS} from "mobx";

@observer
export default class Card extends React.PureComponent {

    static propTypes = {
        column: PropTypes.number.isRequired,
        row: PropTypes.number.isRequired
    };

    state = {
        active: false,
        card: {}
    };

    removeCardSynchroniser;

    constructor (props) {
        super(props);

        this.choose = this.choose.bind(this);
    }

    static getDerivedStateFromProps (nextProps) {
        return {
            card: $game.getCard(nextProps.column, nextProps.row)
        };
    }

    componentDidMount () {
        this.removeCardSynchroniser = reaction(() => JSON.stringify($game.cards), () => this.setState({}));
    }

    componentWillUnmount () {
        this.removeCardSynchroniser();
    }

    choose () {
        if (this.state.card.active) {
            return;
        }

        $game.choose(this.props.column, this.props.row);
    }

    render () {
        const style = {};
        let className = 'card';
        if (this.state.card.active) {
            className += ' active';
        }

        let symbol;
        if (!this.state.card.active) {
            symbol = 'cloud';
        } else {
            symbol = this.state.card.symbol;
            style.color = this.state.card.color;
        }

        return (
            <a className={className} onClick={this.choose}>
                <i className={`fa fa-${symbol}`} style={style} />
            </a>
        );
    }
}