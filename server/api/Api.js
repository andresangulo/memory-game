const find = require('lodash').find;
const allCards = require('../constants/symbols.json');
const allColors = require('../constants/colors.json');
const ArrayUtils = require("../util/ArrayUtils");

class Api {

    static PAUSE_FOR_NEXT_USER = 2000;

    waitingToAdvance = false;
    currentUsername = false;
    choices = [];
    cards = [];
    users = [];
    matches = [];

    get TOTAL_CHOICES () {
        return 2;
    }

    get TOTAL_MATCHES () {
        return (this.TOTAL_ROWS * this.TOTAL_COLUMNS) / 2;
    }

    get TOTAL_COLUMNS () {
        return 6;
    }

    get TOTAL_ROWS () {
        return 4;
    }

    async restart () {
        const cards = [];
        for (let index = 0; index < this.TOTAL_MATCHES; index++) {
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
        this.matches = [];
    }

    async login (username) {
        if (this.users.indexOf(username) >= 0) {
            return;
        }

        this.users.push(username);
        if (this.users.length === 1) {
            this.restart();
        }

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
                const moveIndex = this.matches.indexOf(card.group);
                if (moveIndex) {
                    this.matches.splice(moveIndex, 1);
                }
            }
        });

        if (this.currentUsername === username) {
            this.advanceToNextUser();
        }
    }

    async choose (row, column) {
        if (this.waitingToAdvance) {
            return;
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
                this.matches.push(card.group);
                this.choices = [];
            }
        }
    }

    async getState () {
        return {
            currentUsername: this.currentUsername,
            choices: this.choices,
            cards: this.cards,
            users: this.users,
            matches: this.matches
        }
    }

    async revert (group) {
        const index = this.matches.indexOf(group);
        if (index < 0) {
            return;
        }

        this.matches.slice(index).forEach(group => {
            this.cards.forEach(card => {
                if (card.group === group) {
                    delete card.resolvedBy;
                }
            });
        });

        this.matches.splice(index);
    }

    async end () {
        this.users = [];
        await this.restart();
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

    getCardIndex (row, column) {
        return (row * this.TOTAL_COLUMNS) + column;
    }

    isMatch (choices) {
        if (choices.length === 0) {
            return false;
        }

        const referenceCard = this.cards[this.getCardIndex(choices[0].row, choices[0].column)];
        return !choices.some(({row, column}) => this.cards[this.getCardIndex(row, column)].group !== referenceCard.group);
    }
}

module.exports = new Api();