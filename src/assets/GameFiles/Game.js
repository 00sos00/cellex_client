/*global $*/

import Socket from './SocketFiles/Socket';
import HotkeysHandler from './HotkeysHandler';
import PlayerManager from './PlayerManagerFiles/PlayerManager';

export default class Game {
    constructor(ws) {
        this.socket = new Socket(this, ws);
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
            scale: 1,
            zoom: 1
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
            }
        }
        this.leaderBoard = new Map();
        this.gameCells =    new Map();
        this.ownedCells =   new Map();
        this.playerCells =  new Map();
        this.ejectedCells = new Map();
        this.foodCells =    new Map();
        this.virusCells =   new Map();
        this.motherCells =  new Map();
        this.mainOpen = true;
    }

    showMain() {
        $("#mainPlay").fadeIn(250);
        $("#background").fadeIn(250);
        this.mainOpen = true;
    }

    hideMain() {
        $("#mainPlay").fadeOut(250);
        $("#background").fadeOut(250);
        this.mainOpen = false;
    }

    resetEverything() {
        this.scene.clearStage();
        this.leaderBoard.clear();
        this.playerManager.players.clear();
    }
}