//import showNotif from '../Functions/showNotif'; showNotif

export default class ProfileHandler {
    constructor(game) {
        this.game = game;
        this.profile = {};
    }

    checkLoggedIn() {
        if (localStorage.accessToken && localStorage.accessToken != "undefined")
            this.game.apiSocket.connect();
        else
            this.game.EventHandler.emit('loggedOut');
    }

    login(e) {
        window.open("http://localhost/api/login/url", "", "width=550, height=650");
        window.loginBtn = e.target;
        window.loginBtn.disabled = true;
    }

    logout() {
        this.game.apiSocket.close();
    }

    updateProfile(data) {
        console.log(data)
        this.profile = {
            name: data.discUsername,
            coins: data.coins,
            xp: data.xp
        }
    }

    resetProfile() {
        this.profile = {};
    }
}