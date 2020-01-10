import '../stylesheets/components/card.less';

import React from 'react';
import PropTypes from 'prop-types';

import $game from '../service/GameService';

export default class Card extends React.PureComponent {

    static propTypes = {
        column: PropTypes.number.isRequired,
        row: PropTypes.number.isRequired
    };

    state = {
        card: {}
    };

    constructor (props) {
        super(props);

        this.choose = this.choose.bind(this);
    }

    choose () {
        if (this.props.card.active) {
            return;
        }

        $game.choose(this.props.row, this.props.column);
    }

    render () {
        let className = 'card';
        if (typeof this.props.card.resolvedBy === 'string') {
            className += ' resolved'
        } else if (this.props.card.active) {
            className += ' active';
        }

        return (
            <div className={className}>
                <a className={'background'} onClick={this.choose}>
                    <i className={`fa fa-cloud`} />
                </a>
                <a className={'foreground'}>
                    <i className={`fa fa-${this.props.card.symbol}`} style={{color: this.props.card.color}} />
                </a>
            </div>
        );
    }
}