import EventEmitter from 'events';

// Currently mocked
class Api extends EventEmitter {

    cards = [];
    users = [];

    get TOTAL_CHOICES () {
        return 2;
    }

    get TOTAL_CARDS () {
        return this.TOTAL_ROWS * this.TOTAL_COLUMNS;
    }

    get TOTAL_MATCHES () {
        return this.TOTAL_CARDS / this.TOTAL_CHOICES;
    }

    get TOTAL_COLUMNS () {
        return 6;
    }

    get TOTAL_ROWS () {
        return 4;
    }

    async send (method, endpoint, data = {}) {
        const configuration = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache'
        };

        if (method === 'POST' || method === 'PUT') {
            configuration.body = JSON.stringify(data);
        }

        const request = new Request(`http://localhost:3060/${endpoint}`, configuration);

        try {
            const response = await fetch(request);
            return response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    async restart () {
        return this.send('GET', 'state/restart/');
    }

    async login (username) {
        return this.send('POST', 'user/', {username});
    }

    async logout (username) {
        return this.send('DELETE', 'user/' + username);
    }

    async choose (row, column) {
        return this.send('POST', 'card/', {row, column});
    }

    async getState () {
        return this.send('GET', 'state/');
    }

    async revert (group) {
        return this.send('DELETE', 'state/' + group);
    }

    async end () {
        return this.send('DELETE', '');
    }
}

export default new Api();