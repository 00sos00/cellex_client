//import showNotif from '../Functions/showNotif'; showNotif

export default class ProfileHandler {
    constructor(game) {
        this.game = game;
    }

    checkLoggedIn() {
        if (localStorage.accessToken && localStorage.accessToken != "undefined")
            this.game.EventHandler.emit('loggedIn');
        else
            this.game.EventHandler.emit('loggedOut');
    }

    login(e) {
        window.open("http://localhost/api/login/url", "", "width=500, height=600");
        window.loginBtn = e.target;
        window.loginBtn.disabled = true;
    }

    logout() {

    }
}