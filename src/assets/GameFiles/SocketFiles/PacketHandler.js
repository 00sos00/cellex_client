import Reader from './Reader';
import Color from '../Color';
import packets from './packets.json';
import Cell from '../Cell';

export default class PacketHandler {
    constructor(socket) {
        this.socket = socket;
    }

    // <=== PACKETS TO SEND ===>
    sendPingRequest() {
        this.socket.sendPacket(1, {
            1: { func: "setStringUTF8", value: Date.now().toString() }
        });
    }

    sendMouse(x, y) {
        this.socket.sendPacket(2, {
            1: { func: "setUint32", value: x },
            2: { func: "setUint32", value: y }
        });
    }

    sendChatMessage(message) {
        this.socket.sendPacket(3, {
            1: { func: "setStringUTF8", value: message }
        });
    }

    joinGame(data) {
        this.socket.sendPacket(4, {
            1: { func: "setStringUTF8", value: JSON.stringify(data) }
        });
    }

    startFeeding() {
        this.socket.sendPacket(5);
    }

    stopFeeding() {
        this.socket.sendPacket(6);
    }

    split() {
        this.socket.sendPacket(7);
    }

    doublesplit() {
        this.socket.sendPacket(8);
    }

    triplesplit() {
        this.socket.sendPacket(9);
    }

    split16() {
        this.socket.sendPacket(10);
    }

    respawn(data) {
        this.socket.sendPacket(11, {
            1: { func: "setStringUTF8", value: JSON.stringify(data) }
        });
    }

    startSpectating() {
        this.socket.sendPacket(12);
        this.socket.game.hideMain();
    }

    stopSpectating() {
        this.socket.sendPacket(13);
    }


    // <=== PACKETS TO RECIEVE ===>
    onCachePlayer(reader) {
        const playerId = reader.getUint16();
        const playerName = reader.getStringUTF8();
        const playerSkinCode = reader.getStringUTF8();
        this.socket.game.playerManager.getPlayerById(playerId).cacheNameText(playerName);
        this.socket.game.playerManager.getPlayerById(playerId).cacheSkin(playerSkinCode);
    }

    onDeath() {
        this.socket.game.showDeathMenu();
    }

    onRestart() {
        window.restartTime = 15;
        window.restartI = setInterval(() => {
            this.socket.game.showNotif(`Server Restarting In ${window.restartTime} Seconds`, 750);
            window.restartTime--;
            if (window.restartTime <= -1)
                clearInterval(window.restartI);
        }, 1000);
        this.socket.game.showNotif(`Server Restarting In ${window.restartTime} Seconds`, 750);
        window.restartTime--;
    }

    onPing(reader) {
        const ping = reader.getStringUTF8();
        this.socket.game.Ping = isNaN(ping) ? 0 : ping < 0 ? 0 : parseInt(ping, 10);
    }

    updateCells(reader) {
        for (let i = 0, c = reader.getUint16(); i < c; i++) { 
            const hunterID = reader.getUint32();
            const preyID   = reader.getUint32();

            if (this.socket.game.gameCells.has(preyID) && this.socket.game.gameCells.has(hunterID))
                this.socket.game.gameCells.get(preyID).destroy(hunterID);
        }

        for(;;) {
            let cellId = reader.getUint32();
            if (cellId == 0) break;
            let cellX = reader.getInt32();
            let cellY = reader.getInt32();
            let cellS = reader.getUint16();
            let cellpID = reader.getUint16();
            let cellFMask = reader.getUint8();
            let cellFlags = {
                isPlayer:   !!(cellFMask & 1),
                isFood: !!(cellFMask & 2),
                isVirus:  !!(cellFMask & 4),
                isEjected:    !!(cellFMask & 8),
                isMotherCell: !!(cellFMask & 16),
                isGhostCell: !!(cellFMask & 32)
            }
            let cellColor = new Color('rgb', {
                r: reader.getUint8(),
                g: reader.getUint8(),
                b: reader.getUint8(),
            });
            
            if (this.socket.game.gameCells.has(cellId)) {
                let cellToUpdate = this.socket.game.gameCells.get(cellId);
                    cellToUpdate.nx = cellX;
                    cellToUpdate.ny = cellY;
                    cellToUpdate.ns = cellS;
                    cellToUpdate.viewRange = Math.ceil(this.socket.game.camera.scale * cellS);
            } else {
                let newCell = new Cell(cellId, cellpID, cellX, cellY, cellS, cellColor, cellFlags, this.socket.game);
                this.socket.game.gameCells.set(newCell.id, newCell);
                switch(newCell.type) {
                    case 'Player': {
                        this.socket.game.playerCells.set(cellId, newCell);
                        newCell.isMine && this.socket.game.ownedCells.set(cellId, newCell);
                        break;
                    }
                    case 'Ejected': {
                        this.socket.game.ejectedCells.set(cellId, newCell);
                        break;
                    }
                    case 'Food': {
                        this.socket.game.foodCells.set(cellId, newCell);
                        break;
                    }
                    case 'Virus': {
                        this.socket.game.virusCells.set(cellId, newCell);
                        break;
                    }
                    case 'MotherCell': {
                        this.socket.game.motherCells.set(cellId, newCell);
                        break;
                    }
                }
            }
        }

        for (let i = 0, c = reader.getUint16(); i < c; i++) {
            let removedNodeID = reader.getUint32();
            this.socket.game.gameCells.has(removedNodeID) && this.socket.game.gameCells.get(removedNodeID).destroy();
        }
    }

    onSpectatePosition(reader) {
        this.socket.game.camera.spectateX = reader.getFloat32();
        this.socket.game.camera.spectateY = reader.getFloat32();
    }

    clearAllCells() {
        this.socket.game.gameCells.clear();
        this.socket.game.playerCells.clear();
        this.socket.game.ownedCells.clear();
        this.socket.game.foodCells.clear();
        this.socket.game.ejectedCells.clear();
        this.socket.game.virusCells.clear();
        this.socket.game.motherCells.clear();
    }

    updateLeaderboard(reader) {
        this.socket.game.leaderBoard.clear();
        for (let i = 0, c = reader.getUint32(); i < c; i++) {
            this.socket.game.leaderBoard.list.set(i + 1, {
                isMe: !!reader.getUint32(),
                name: reader.getStringUTF8()
            });
        }
        this.socket.game.scene.updateLeaderboard();
    }

    setBorder(reader) {
        this.socket.game.scene.clearStage();
        this.socket.game.border.left = reader.getFloat64();
        this.socket.game.border.top = reader.getFloat64();
        this.socket.game.border.right = reader.getFloat64();
        this.socket.game.border.bottom = reader.getFloat64();
        this.socket.game.border.width = this.socket.game.border.right - this.socket.game.border.left;
        this.socket.game.border.height = this.socket.game.border.bottom - this.socket.game.border.top;
        this.socket.game.border.centerX = (this.socket.game.border.right + this.socket.game.border.left) / 2;
        this.socket.game.border.centerY = (this.socket.game.border.top + this.socket.game.border.bottom) / 2;
        this.socket.game.scene.drawBorder();
    }

    onChatMessage(reader) {
        let messages = [...this.socket.game.chat.messages.value];
        let flags = reader.getUint8();
        messages.push({
            type: {
                isServer: !!(flags & 0x80),
                isAdmin: !!(flags & 0x40)
            },
            color: new Color('rgb', {
                r: reader.getUint8(),
                g: reader.getUint8(),
                b: reader.getUint8(),
            }),
            name: reader.getStringUTF8(),
            text: reader.getStringUTF8()
        });
        this.socket.game.chat.messages.value = messages;
    }

    removePlayer(reader) {
        let playerId = reader.getUint16();
        this.socket.game.playerManager.removePlayer(playerId);
    }

    updatePlayers(reader) {
        for (let i = 0, c = reader.getUint16(); i < c; i++) {
            const data = {
                id: reader.getUint32(),
                isMe: reader.getUint32() ? true : false,
                inTag: reader.getUint32() ? true : false,
                IDLE: reader.getUint32() ? true : false,
                SPEC: reader.getUint32() ? true : false,
                PLAY: reader.getUint32() ? true : false,
                playerX: reader.getInt32(),
                playerY: reader.getInt32(),
                playerS: reader.getUint32() / 100,
                cellsAmount: reader.getUint16(),
                maxCells: reader.getUint16(),
                color: new Color('rgb', {
                    r: reader.getUint16(),
                    g: reader.getUint16(),
                    b: reader.getUint16(),
                }),
                name: reader.getStringUTF8(),
                skinCode: reader.getStringUTF8()
            }

            if (!this.socket.game.playerManager.players.has(data.id)) {
                this.socket.game.playerManager.addPlayer(data);
                setTimeout(() => {
                    this.socket.game.playerManager.getPlayerById(data.id).cacheNameText();
                    this.socket.game.playerManager.getPlayerById(data.id).cacheSkin();
                }, 50);
            }
            this.socket.game.playerManager.getPlayerById(data.id).update(data);
        }
    }

    handleMessage(message) {
        const reader = new Reader(new DataView(message.data), 0, true);
        const packetId = reader.getUint8();

        switch(packetId) {
            case packets['CACHE_NAME']: {
                this.onCacheName(reader);
                break;
            }
            case packets['CACHE_PLAYER']: {
                this.onCachePlayer(reader);
                break;
            }
            case packets['PLAYER_DEATH']: {
                this.onDeath();
                break;
            }
            case packets['RESTART']: {
                this.onRestart();
                break;
            }
            case packets['PING']: {
                this.onPing(reader);
                break;
            }
            case packets['UPDATE_CELLS']: {
                this.updateCells(reader);
                break;
            }
            case packets['SPECTATE_POS']: {
                this.onSpectatePosition(reader);
                break;
            }
            case packets['CLEAR_ALL']: {
                this.clearAllCells();
                break;
            }
            case packets['UPDATE_LB']: {
                this.updateLeaderboard(reader);
                break;
            }
            case packets['SET_BORDER']: {
                this.setBorder(reader);
                break;
            }
            case packets['CHAT_MSG']: {
                this.onChatMessage(reader);
                break;
            }
            case packets['DELETE_PLAYER']: {
                this.removePlayer(reader);
                break;
            }
            case packets['UPDATE_PLAYERS']: {
                this.updatePlayers(reader);
                break;
            }
            default:
                break;
        }
    }
}