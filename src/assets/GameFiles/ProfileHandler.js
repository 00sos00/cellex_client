import { ref } from 'vue';

export default class ProfileHandler {
    constructor(game) {
        this.game = game;
        this.profile = {
            id: ref(0),
            name: ref(''),
            xp: ref(0),
            totalXp: ref(0),
            level: ref(0),
            requiredXp: ref(0),
            progress: ref(1),
            avatarLink: ref(""),
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
        if (this.game.apiSocket.isConnected())
            this.game.apiSocket.close();
        if (this.game.socket.isConnected())
            this.game.socket.close();
    }

    updateProgressCircles() {
        const progressCircles = [...document.getElementsByClassName('xpCircleProgress')];
        const progressCircleAnimation = document.getElementById('progressAnimation');

        progressCircles.forEach(circle => {
            const circleRadius = circle.r.baseVal.value;
            const fullRadius = circleRadius * 2 * Math.PI;
            const progress = fullRadius - (this.profile.progress.value / 100) * fullRadius;
            
            circle.style.strokeDasharray = fullRadius;
            circle.style.strokeDashoffset = progress;
            progressCircleAnimation.setAttribute("to", progress)
        });
    }

    updateProfile(data) {
        const coins = data.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        let currentXp = data.xp;
        let currentLevel = 1;
        let requiredXp = 2345;

        while (currentXp >= requiredXp) {
            currentXp -= requiredXp;
            requiredXp *= 1.05;
            currentLevel++;
        }
        const progress = currentXp ? Math.floor(currentXp / requiredXp * 100) : 1;

        this.profile.id.value = data.id;
        this.profile.name.value = data.discUsername;
        this.profile.avatarLink.value = `https://cdn.discordapp.com/avatars/${data.discId}/${data.discAvatar}`;
        this.profile.xp.value = Math.floor(currentXp);
        this.profile.totalXp.value = data.xp;
        this.profile.level.value = currentLevel;
        this.profile.requiredXp.value = Math.floor(requiredXp);
        this.profile.progress.value = progress;
        this.profile.coins.value = coins;
    }

    resetProfile() {
        this.profile = {
            id: ref(0),
            name: ref(''),
            xp: ref(0),
            totalXp: ref(0),
            level: ref(0),
            requiredXp: ref(0),
            progress: ref(1),
            avatarLink: ref(""),
            coins: ref(0)
        };
    }
}