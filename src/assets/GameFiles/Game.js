/*global $*/

import Socket from './SocketFiles/Socket';
import HotkeysHandler from './HotkeysHandler';
import PlayerManager from './PlayerManagerFiles/PlayerManager';

export default class Game {
    constructor() {
        this.socket = new Socket(this);
        this.hotkeysHandler = new HotkeysHandler(this);
        this.playerManager = new PlayerManager(this);
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
            messages: new Map(),
            clear() {
                this.messages.clear();
                document.getElementById('messages').innerHTML = '';
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
        let name = localStorage.getItem('name') || '';
        let tag = localStorage.getItem('tag') || '';
        let skinCode = localStorage.getItem('skinCode') || '';
        this.socket.packetHandler.joinGame({name, tag, skinCode});
        this.hideMain();
    }

    showMain() {
        $(".main").fadeIn(250);
        this.mainOpen = true;
    }

    hideMain() {
        $(".main").fadeOut(250);
        this.mainOpen = false;
    }

    resetEverything() {
        this.scene.clearStage();
        this.chat.clear();
        this.leaderBoard.clear();
        this.playerManager.players.clear();
    }
}