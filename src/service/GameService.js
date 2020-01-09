import $api from '../api/Api';
import {observable} from "mobx";

class GameService {

    get TOTAL_ROWS () {
        return $api.TOTAL_ROWS;
    }

    get TOTAL_COLUMNS () {
        return $api.TOTAL_COLUMNS;
    }

    @observable
    loaded = false;

    @observable
    loggedIn = false;

    @observable
    username = false;

    @observable
    cards = [];

    @observable
    moves = [];

    @observable
    choices = [];

    @observable
    users = [];

    @observable
    currentUserIndex = false;

    constructor () {
        this.initialize();
    }

    async initialize () {
        await $api.restart();
        await this.updateState();
        this.loaded = true;
    }

    async updateState () {
        const state = await $api.getState();
        this.cards = state.cards;
        this.users = state.users;
        this.currentUserIndex = state.currentUserIndex;
        this.moves = state.moves;
        this.choices = state.choices;
    }

    async login (username) {
        if (this.loggedIn) {
            console.log(`Already logged in as ${this.username}`);
            return;
        }

        this.username = username;
        try {
            console.log('Logging in...');
            await $api.login(username);
            this.loggedIn = true;
            console.log(`Logged in as ${username}`);
        } catch (error) {
            this.loggedIn = false;
            console.error('Unable to log in');
        }
    }

    async logout () {
        if (!this.loggedIn) {
            console.log('Not logged in');
            return;
        }

        this.username = false;
        this.loggedIn = false;
    }

    getCard (column, row) {
        return this.cards[(column * this.TOTAL_COLUMNS) + row];
    }

    async choose (column, row) {
        await $api.choose(column, row);
        await this.updateState();
    }
}

export default new GameService();