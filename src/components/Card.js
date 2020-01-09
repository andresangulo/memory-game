import '../stylesheets/components/card.less';

import React from 'react';
import PropTypes from 'prop-types';

import symbols from '../symbols.json';

import $game from '../service/GameService';

export default class Card extends React.PureComponent {

    static propTypes = {
        column: PropTypes.number.isRequired,
        row: PropTypes.number.isRequired
    };

    state = {
        active: true
    };

    constructor (props) {
        super(props);

        this.setActive = this.setActive.bind(this);
    }

    componentDidMount () {
        $game.on('active', this.requestActiveState);
    }

    componentWillUnmount () {
        $game.removeListener('active', this.requestActiveState);
    }

    requestActiveState () {
        this.setActive($game.isCardActive(this.props.column, this.props.row));
    }

    setActive (active) {
        this.setState({active});
    }

    render () {
        let className = 'card';
        if (this.state.active) {
            className += ' active';
        }

        let symbol;
        if (!this.state.active) {
            symbol = 'cloud';
        } else {
            symbol = symbols[(this.props.row * ($game.TOTAL_ROWS + 1)) + this.props.column + (this.props.row ? 1 : 0)] || 'refresh';
//            symbol = this.props.symbol
        }

        return (
            <div className={className}>
                <i className={`fa fa-${symbol}`} />
            </div>
        );
    }
}