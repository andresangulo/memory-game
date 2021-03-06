import $api from '../api/Api';
import {computed, observable} from "mobx";

class GameService {

    static POLL_INTERVAL = 50;
    static STATE_DESCRIBING_FIELDS = ['cards', 'users', 'currentUsername', 'matches', 'choices'];

    get TOTAL_CARDS () {
        return $api.TOTAL_CARDS;
    }

    get TOTAL_MATCHES () {
        return $api.TOTAL_MATCHES;
    }

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
    matches = [];

    @observable
    choices = [];

    @observable
    users = [];

    @observable
    currentUsername = false;

    @computed
    get ready () {
        return this.cards.length === this.TOTAL_CARDS;
    }

    get ownTurn () {
        return this.currentUsername === this.username;
    }

    constructor () {
        this.initialize();
        if (localStorage.username) {
            this.login(localStorage.username);
        }
    }

    async initialize () {
        this.pollState();
        this.loaded = true;
    }

    async pollState () {
        await this.updateState();
        setTimeout(() => this.pollState(), GameService.POLL_INTERVAL);
    }

    async updateState () {
        const state = await $api.getState();
        // We check the state before assigning because assigning makes mobx emit an effect which forces re-rendering across the board, even without
        // anything having changed
        GameService.STATE_DESCRIBING_FIELDS.forEach(field => {
            // this[field] is an observable and therefore has all the mobx metadata. Comparing JSON strings strips the metadata
            if (JSON.stringify(this[field]) !== JSON.stringify(state[field])) {
                this[field] = state[field];
            }
        });

        if (this.loggedIn && this.users.indexOf(this.username) < 0) {
            this.logout();
        }
    }

    async login (username) {
        if (this.loggedIn) {
            return;
        }

        this.username = username;
        try {
            await $api.login(username);
            localStorage.username = username;
            this.loggedIn = true;
        } catch (error) {
            this.loggedIn = false;
        }
    }

    async logout () {
        if (!this.loggedIn) {
            return;
        }

        await $api.logout(this.username);
        this.username = false;
        this.loggedIn = false;
        delete localStorage.username;
    }

    async bootUser (username) {
        $api.logout(username);
    }

    async choose (row, column) {
        return $api.choose(row, column);
    }

    async revert (group) {
        return $api.revert(group);
    }

    async restart () {
        return $api.restart();
    }

    async end () {
        return $api.end();
    }

    getCard (row, column) {
        return this.cards[(row * this.TOTAL_COLUMNS) + column];
    }
}

export default new GameService();