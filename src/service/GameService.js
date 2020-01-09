import EventEmitter from 'events';

import $api from '../api/Api';

class GameService extends EventEmitter {

    get TOTAL_ROWS () {
        return 4;
    }

    get TOTAL_COLUMNS () {
        return 6;
    }

    _loggedIn = false;
    _username = false;

    constructor () {
        super();
        this.setMaxListeners(100);
    }

    async login (username) {
        if (this.loggedIn) {
            console.log(`Already logged in as ${this._username}`);
            return;
        }

        this.emit('logging-in');
        this._username = username;
        try {
            console.log('Logging in...');
            await $api.login(username);
            this._loggedIn = true;
            this.emit('logged-in');
            console.log(`Logged in as ${username}`);
            return true;
        } catch (error) {
            this._loggedIn = false;
            this.emit('logging-in-error');
            console.error('Unable to log in');
            return false;
        }
    }

    async logout () {
        if (!this._loggedIn) {
            console.log('Not logged in');
            return;
        }

        this.emit('logging-out');
        this._username = false;
        this._loggedIn = false;
        this.emit('logged-out');
    }

    async getUserList () {
        return $api.getUserList();
    }

    async getMoveList () {
        return [];
    }

    get username () {
        return this._username;
    }

    get loggedIn () {
        return this._loggedIn;
    }

    isCardActive (column, row) {
        return false;
    }
}

export default new GameService();