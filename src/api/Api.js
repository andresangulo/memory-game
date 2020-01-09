import EventEmitter from 'events';

import {find} from 'lodash';

import allCards from '../symbols.json';
import allColors from '../colors.json';
import ArrayUtils from "../util/ArrayUtils";

// Currently mocked
class Api extends EventEmitter {

    currentUserIndex = false;
    choices = [];
    cards = [];
    users = ['andres', 'rebecca'];
    moves = [];

    get TOTAL_CHOICES () {
        return 2;
    }

    get TOTAL_ROWS () {
        return 4;
    }

    get TOTAL_COLUMNS () {
        return 6;
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

            const pair = cards.length / 2;
            cards.push({
                symbol: allCards[cardIndex],
                pair
            });

            cards.push({
                symbol: allCards[cardIndex],
                pair
            });
        }

        const shuffledColors = ArrayUtils.shuffle(allColors);
        this.cards = ArrayUtils.shuffle(ArrayUtils.shuffle(cards.map(card => Object.assign(card, {color: shuffledColors[card.pair]}))));
        this.currentUserIndex = 0;
        this.choices = [];
        this.moves = [];
    }

    getCardIndex (row, column) {
        return (column * (this.TOTAL_COLUMNS)) + row;
    }

    async login (username) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(username);
            }, 5);
        })
    }

    async checkForPairs () {

    }

    async choose (column, row) {
        this.choices.push({row, column});
        const index = this.getCardIndex(row, column);
        this.cards[index].active = true;
        await this.checkForPairs();
        if (this.choices.length >= this.TOTAL_CHOICES) {
            await this.advanceToNextUser();
        }
    }

    async advanceToNextUser () {
        this.currentUserIndex++;
        if (this.currentUserIndex >= this.users.length) {
            this.currentUserIndex = 0;
        }

        this.choices = [];
    }

    async getState () {
        return {
            currentUserIndex: this.currentUserIndex,
            choices: this.choices,
            cards: this.cards,
            users: this.users,
            moves: this.moves
        }
    }
}

export default new Api();