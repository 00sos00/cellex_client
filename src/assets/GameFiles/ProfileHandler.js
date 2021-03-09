import { ref } from 'vue';

export default class ProfileHandler {
    constructor(game) {
        this.game = game;
        this.profile = {
            name: ref(''),
            xp: ref(0),
            level: ref(0),
            coins: ref(0)
        };
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
        if (this.game.socket.isConnected())
            this.game.socket.close();
    }

    updateProfile(data) {
        const parseCoins = (c) => c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const coins = parseCoins(data.coins);
        const level = 0;

        this.profile.name.value = data.discUsername;
        this.profile.xp.value = data.xp;
        this.profile.level.value = level;
        this.profile.coins.value = coins;
    }

    resetProfile() {
        this.profile = {
            name: ref(''),
            xp: ref(0),
            level: ref(0),
            coins: ref(0)
        };
    }
}