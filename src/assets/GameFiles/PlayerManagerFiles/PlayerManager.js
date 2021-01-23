import Player from './Player';

export default class playerManager {
    constructor(game) {
        this.game = game;
        this.players = new Map();
    }

    removeAllPlayers() {
        this.players.clear();
    }

    getPlayerById(id) {
        return this.players.get(id);
    }

    getAllPlayers() {
        return this.players;
    }

    getOwnPlayer() {
        let player = null;
        this.players.forEach(p => {
            if (p.isMe) player = p;
        });
        return player;
    }

    addPlayer(playerData) {
        const p = new Player(playerData, this.game);

        this.players.set(p.id, p);
    }

    removePlayer(id) {
        this.players.delete(id);
    }
}