import EventEmitter from 'events';

class Api extends EventEmitter {

    async send (endpoint, data) {

    }

    async login (username) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(username);
            }, 5);
        })
    }

    async getUserList () {
        return ['andres', 'rebecca'];
    }
}

export default new Api();