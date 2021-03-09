import Reader from './SocketFiles/Reader';
import Writer from './SocketFiles/Writer';

export default class Color {
    constructor(game) {
        this.game = game;
        this.wsConnection = null;
        this.wsURL = 'ws://localhost:3000/api/connection';
    }


    /* <=== Other Functions ===> */


    isConnected() {
        return this.wsConnection && this.wsConnection.readyState === 1;
    }

    close() {
        this.wsConnection && this.wsConnection.close();
        this.wsConnection = null;
    }

    startPingLoop() {
        this.pingLoop = setInterval(() => {
            this.sendPingPacket();
        }, 15000);
    }

    stopPingLoop() {
        this.pingLoop && clearInterval(this.pingLoop);
    }


    /* <=== Connection ===> */


    connect() {
        this.wsConnection = new WebSocket(this.wsURL);
        this.wsConnection.binaryType = "arraybuffer";
        this.wsConnection.onopen = this.onOpen.bind(this);
        this.wsConnection.onclose = this.onClose.bind(this);
        this.wsConnection.onmessage = this.onMessage.bind(this);
    }

    onOpen() {
        this.sendTokenPacket();
        this.startPingLoop();
    }

    onClose() {
        this.game.EventHandler.emit('loggedOut');
        this.stopPingLoop();
    }

    onMessage(msg) {
        const reader = new Reader(new DataView(msg.data), 0, true);
        const packetId = reader.getUint8();

        switch(packetId) {
            case 1: {
                const data = JSON.parse(reader.getStringUTF8());
                this.game.profileHandler.updateProfile(data);
                this.game.EventHandler.emit('loggedIn');
                break;
            }
            case 2: {
                this.game.showNotif(reader.getStringUTF8(), 2000);
                break;
            }
            case 3: {
                this.game.EventHandler.emit('loggedOut');
                break;
            }
            default:
                break;
        }
    }


    /* <=== Sending Packets ===> */


    sendPingPacket() {
        if (!this.isConnected()) return;
        const packet = new Writer(true);

        packet.setUint8(5);
        if (packet.build)
            this.wsConnection.send(packet.build());
        else 
            this.wsConnection.send(packet);
    }

    sendTokenPacket() {
        if (!this.isConnected()) return;
        const packet = new Writer(true);
        const token = localStorage.accessToken;

        packet.setUint8(1);
        packet.setStringUTF8(token);
        if (packet.build)
            this.wsConnection.send(packet.build());
        else 
            this.wsConnection.send(packet);
    }
}