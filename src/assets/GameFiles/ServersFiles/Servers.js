import serversTemplate from './serversTemplate.json';

export default class Servers {
    constructor(game, defaultTabBtn, euRef, naRef) {
        this.game = game;
        this.defaultTabBtn = defaultTabBtn;
        this.template = {};
        this.euRef = euRef;
        this.naRef = naRef;
        this.secondsBeforeUpdate = 15;
        this.updateInterval = setInterval(() => {
            this.updateServers();
        }, this.secondsBeforeUpdate * 1000);
        this.updateServers();
    }

    onOpen() {
        this.defaultTabBtn && this.defaultTabBtn.value.click();
    }

    getEU() {
        return this.template['Europe'];
    }

    getNA() {
        return this.template['North America'];
    }

    updateServers() {
        this.template = serversTemplate;
        this.euRef.value = this.getEU();
        this.naRef.value = this.getNA();
    }

    connect(e) {
        if (e.target.dataset.isfull == "true")
            return this.game.showNotif('Server Full', 1000);
        const server = JSON.parse(e.target.dataset.server);
        const serverGamemode = e.target.dataset.gamemode;
        const serverOrigin = server.origin;
        const serverPort = server.port;
        
        [...document.getElementsByClassName('gamemodeServer')].forEach(server => {
            server.classList.remove('selectedServer');
        });
        e.target.classList.add('selectedServer');

        this.game.socket.connect(`${serverOrigin}:${serverPort}`, serverGamemode);
    }

    switchTab(e) {
        const serversTabButtons = Array.from(document.getElementsByClassName('serversTabBtn'));
        const serversTabs = Array.from(document.getElementsByClassName('serversTab'));

        // Remove selected class from all buttons first
        serversTabButtons.forEach(btn => btn.classList.remove('selectedTab'));
        serversTabs.forEach(tab => {
            tab.style.display = 'none';
        });

        switch(e.target.innerText) {
            case 'Europe': {
                document.getElementById(e.target.innerText).style.display = 'block';
                e.target.classList.add('selectedTab');
                break;
            }
            case 'North America': {
                document.getElementById(e.target.innerText).style.display = 'block';
                e.target.classList.add('selectedTab');
                break;
            }
        }
    }
}