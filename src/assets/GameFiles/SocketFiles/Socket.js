import PacketHandler from './PacketHandler';
//import APIHandler from './apiHandler';
import Writer from './Writer';

export default class Socket {
    constructor(game) {
        this.game = game;
        this.wsConnection = null;
        this.packetHandler = new PacketHandler(this);
        //this.apiHandler = new APIHandler(this);
        this.currentGamemode = '';
    }

    isConnected() {
        return this.wsConnection && this.wsConnection.readyState === 1;
    }

    connect(ip, gamemode) {
        // Check whether to use ws or wss
        ip = `ws${window.location.protocol === 'https:' ? 's' : ''}://${ip}`;

        // Create connection
        if (this.wsConnection && this.wsConnection.readyState == 1)
            this.wsConnection.close();

        if (ip) {
            this.wsConnection = new WebSocket(ip);
            this.wsConnection.binaryType = "arraybuffer";
            this.wsConnection.onopen = this.onOpen.bind(this);
            this.wsConnection.onclose = this.onClose.bind(this);
            this.wsConnection.onmessage = this.onMessage.bind(this);
            this.currentGamemode = gamemode
        }
    }

    sendPacket(ID, Data = {}) {
        if (this.isConnected()) {
            const packet = new Writer(true);
                  packet.setUint8(ID);
            for (const index in Data)
                packet[Data[index]["func"]](Data[index]["value"]);
            this.wsConnection.send(packet.build ? packet.build() : packet);
        }
    }

    startPingLoop() {
        this.pingLoop = setInterval(() => {
            this.packetHandler.sendPingRequest();
            this.game.FPS = this.game.scene.ticker.FPS;
        }, 1000);
    }

    stopPingLoop() {
        clearInterval(this.pingLoop);
    }

    onOpen() {
        this.game.showNotif('Connected to ' + this.currentGamemode, 1000);
        this.startPingLoop();
    }

    onClose() {
        this.game.showNotif('Disconnected', 1000);
        this.game.resetEverything();
        this.game.showMain();
        this.stopPingLoop();
    }

    onMessage(message) {
        this.packetHandler.handleMessage(message);
    }

    close() {
        this.wsConnection && this.wsConnection.close();
        this.wsConnection = null;
    }
}