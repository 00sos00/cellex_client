import showNotif from '../Functions/showNotif'; showNotif

export default class ProfileHandler {
    constructor(game) {
        this.game = game;
    }

    checkLoggedIn() {

    }

    async login(username, password) {
        let response = await fetch('http://localhost:80/api/login', {
            method: "POST",
            body: { username, password },
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(response);
    }

    logout() {

    }

    async register(username, email, password) {
        let response = await fetch('http://localhost:80/api/register', {
            method: "POST",
            body: { username, email, password },
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(response);
    }
}