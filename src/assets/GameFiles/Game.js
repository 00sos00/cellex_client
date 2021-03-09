import Socket from './SocketFiles/Socket';
import Settings from './SettingsFiles/Settings';
import HotkeysHandler from './HotkeysHandler';
import PlayerManager from './PlayerManagerFiles/PlayerManager';
import ProfileHandler from './ProfileHandler';
import APISocket from './APISocket';

export default class Game {
    constructor(EventHandler) {
        this.EventHandler = EventHandler;
        this.socket = new Socket(this);
        this.settings = new Settings(this);
        this.hotkeysHandler = new HotkeysHandler(this);
        this.playerManager = new PlayerManager(this);
        this.apiSocket = new APISocket(this);
        this.profileHandler = new ProfileHandler(this);
        this.Ping = 0;
        this.FPS = 0;
        this.mouse = {
            x: 0,
            y: 0
        }
        this.camera = {
            x: 0,
            y: 0,
            spectateX: 0,
            spectateY: 0,
            scale: 0.1,
            zoom: 0.1
        }
        this.border = {
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: 0,
            height: 0,
            centerX: 0,
            centerY: 0
        }
        this.chat = {
            messages: [],
            clear() {
                this.messages.value = [];
            }
        }
        this.leaderBoard = {
            list: new Map(),
            clear() {
                this.list.clear();
                document.getElementById('leaderboardRows').innerHTML = '';
            }
        };
        this.gameCells =    new Map();
        this.ownedCells =   new Map();
        this.playerCells =  new Map();
        this.ejectedCells = new Map();
        this.foodCells =    new Map();
        this.virusCells =   new Map();
        this.motherCells =  new Map();
        this.mainOpen = true;
    }

    joinGame() {
        if (!this.socket.isConnectionOpen()) return;
        let name = localStorage.getItem('name') || '';
        let tag = localStorage.getItem('tag') || '';
        let skinCode = localStorage.getItem('skinCode') || '';
        this.socket.packetHandler.joinGame({name, tag, skinCode});
        this.hideMain();
        this.hideDeathMenu();
    }

    respawn() {
        if (!this.socket.isConnectionOpen()) return;
        let name = localStorage.getItem('name') || '';
        let tag = localStorage.getItem('tag') || '';
        let skinCode = localStorage.getItem('skinCode') || '';
        this.socket.packetHandler.respawn({name, tag, skinCode}); 
    }

    showNotif(Title, Timeout) {
        window.notifT && clearTimeout(window.notifT);
        let notifElement = document.getElementById('notif');
            notifElement.textContent = Title;
            this.EventHandler.emit('showNotif');
        window.notifT = setTimeout(() => {
            this.EventHandler.emit('hideNotif');
        }, Timeout);
    }

    showMain() {
        this.hideDeathMenu();
        this.EventHandler.emit('showMain');
        this.mainOpen = true;
    }

    hideMain() {
        this.EventHandler.emit('hideMain');
        this.mainOpen = false;
    }

    showDeathMenu() {
        this.EventHandler.emit('showDeathMenu');
    }

    hideDeathMenu() {
        this.EventHandler.emit('hideDeathMenu');
    }

    resetEverything() {
        this.scene.clearStage();
        this.chat.clear();
        this.leaderBoard.clear();
        this.playerManager.players.clear();
    }
}