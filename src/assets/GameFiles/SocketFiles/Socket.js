import PacketHandler from './PacketHandler';
import Writer from './Writer';

export default class Socket {
    constructor(game) {
        this.game = game;
        this.wsConnection = null;
        this.packetHandler = new PacketHandler(this);
    }

    isConnectionOpen() {
        return this.wsConnection && this.wsConnection.readyState === 1;
    }

    connect(ip) {
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
        }
    }

    sendPacket(packetId) {
        let packet = new Writer(true);
        if (this.isConnectionOpen()) {
            packet.setUint8(packetId);
            if (packet.build) 
                this.wsConnection.send(packet.build()); 
            else
                this.wsConnection.send(packet);
        }
        packet = null;
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
        console.log('Socket opened')
        this.game.scene.app.ticker.start();
        this.startPingLoop();
    }

    onClose() {
        console.log('Socket closed')
        this.game.resetEverything();
        this.game.showMain();
        this.stopPingLoop();
    }

    onMessage(message) {
        this.packetHandler.handleMessage(message);
    }
}