import EventEmitter from 'events';

import {find} from 'lodash';

import allCards from '../symbols.json';
import allColors from '../colors.json';
import ArrayUtils from "../util/ArrayUtils";

// Currently mocked
class Api extends EventEmitter {

    static PAUSE_FOR_NEXT_USER = 400;

    waitingToAdvance = false;
    currentUsername = false;
    choices = [];
    cards = [];
    users = [];
    moves = [];

    get TOTAL_CHOICES () {
        return 2;
    }

    get TOTAL_COLUMNS () {
        return 6;
    }

    get TOTAL_ROWS () {
        return 4;
    }

    async send (endpoint, data) {

    }

    async restart () {
        const cards = [];
        for (let index = 0; index < (this.TOTAL_COLUMNS * this.TOTAL_ROWS) / 2; index++) {
            let cardIndex;
            do {
                cardIndex = Math.floor(Math.random() * allCards.length);
            } while (find(cards, {symbol: allCards[cardIndex]}));

            const group = cards.length / this.TOTAL_CHOICES;
            for (let choice = 0; choice < this.TOTAL_CHOICES; choice++) {
                cards.push({
                    symbol: allCards[cardIndex],
                    group
                });
            }
        }

        const shuffledColors = ArrayUtils.shuffle(allColors);
        this.cards = ArrayUtils.shuffle(ArrayUtils.shuffle(cards.map(card => Object.assign(card, {color: shuffledColors[card.group]}))));
        this.currentUsername = false;
        this.choices = [];
        this.moves = [];
    }

    getCardIndex (row, column) {
        return (row * this.TOTAL_COLUMNS) + column;
    }

    async login (username) {
        this.users.push(username);
        if (!this.currentUsername) {
            this.currentUsername = username;
        }
    }

    async logout (username) {
        const index = this.users.indexOf(username);
        if (index < 0) {
            return;
        }

        this.users.splice(index, 1);
        if (this.users.length === 0) {
            this.restart();
            return;
        }

        this.cards.forEach(card => {
            if (card.resolvedBy === username) {
                delete card.resolvedBy;
                const moveIndex = this.moves.indexOf(card.group);
                if (moveIndex) {
                    this.moves.splice(moveIndex, 1);
                }
            }
        });

        if (this.currentUsername === username) {
            this.advanceToNextUser();
        }
    }

    async choose (row, column) {
        if (this.waitingToAdvance) {
            return false;
        }

        this.choices.push({row, column});
        const index = this.getCardIndex(row, column);
        this.cards[index].active = true;
        if (this.choices.length >= this.TOTAL_CHOICES) {
            if (!this.isMatch(this.choices)) {
                this.waitingToAdvance = true;
                setTimeout(() => this.advanceToNextUser(), Api.PAUSE_FOR_NEXT_USER);
            } else {
                this.choices.forEach(({row, column}) => {
                    Object.assign(this.cards[this.getCardIndex(row, column)], {
                        active: false,
                        resolvedBy: this.currentUsername
                    });
                });

                const card = this.cards[this.getCardIndex(this.choices[0].row, this.choices[0].column)];
                this.moves.push(card.group);
                this.choices = [];
            }
        }
    }

    async advanceToNextUser () {
        let index = this.users.indexOf(this.currentUsername);
        if (index < 0) {
            index = 0;
        } else {
            index++;
        }

        if (index >= this.users.length) {
            index = 0;
        }

        this.currentUsername = this.users[index];
        this.choices = [];
        this.waitingToAdvance = false;
        this.cards.forEach(card => card.active = false);
    }

    async getState () {
        return {
            currentUsername: this.currentUsername,
            choices: this.choices,
            cards: this.cards,
            users: this.users,
            moves: this.moves
        }
    }

    async revert (group) {
        const index = this.moves.indexOf(group);
        if (index < 0) {
            return;
        }

        this.moves.slice(index).forEach(group => {
            this.cards.forEach(card => {
                if (card.group === group) {
                    delete card.resolvedBy;
                }
            });
        });

        this.moves.splice(index);
    }

    async end () {
        this.users = [];
        await this.restart();
    }

    isMatch (choices) {
        if (choices.length === 0) {
            return false;
        }

        const referenceCard = this.cards[this.getCardIndex(choices[0].row, choices[0].column)];
        return !choices.some(({row, column}) => this.cards[this.getCardIndex(row, column)].group !== referenceCard.group);
    }
}

export default new Api();