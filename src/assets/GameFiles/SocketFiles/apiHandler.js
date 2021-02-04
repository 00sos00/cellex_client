import Writer from './Writer';
//import Reader from './Reader';

export default class APIHandler {
    constructor(socket) {
        this.socket = socket;
        /* if (!localStorage.getItem('accessToken'))
            this.getAccessToken();
        else
            this.startWS(); */
    }

    sendRegister(username, email, password) {
        fetch('localhost:80/api/register', {
            body: {
                username, email, password
            },
            headers: ''
        });
    }

    /* getAccessToken() {
        localStorage.setItem('accessToken', 'hello');
        this.startWS();
    }

    sendLoginPacket() {
        if (!this.isConnectionOpen()) return;
        let packet = new Writer(true);
        let accessToken = localStorage.getItem('accessToken');
                
        packet.setUint8(2);
        packet.setStringUTF8(accessToken);
        if (packet.build)
            this.wsConnection.send(packet.build());
        else 
            this.wsConnection.send(packet);
        packet = null;
    } */









    /* <===== WS ====> */

    isConnectionOpen() {
        return this.wsConnection && this.wsConnection.readyState === 1;
    }

    startWS() {
        let wsURL = 'localhost:3000/api/connection';
            wsURL = `ws${window.location.protocol === 'https:' ? 's' : ''}://${wsURL}`;

        // Create connection
        if (this.wsConnection && this.wsConnection.readyState == 1)
            this.wsConnection.close();

        if (wsURL) {
            this.wsConnection = new WebSocket(wsURL);
            this.wsConnection.binaryType = "arraybuffer";
            this.wsConnection.onopen = this.onOpen.bind(this);
            this.wsConnection.onclose = this.onClose.bind(this);
            this.wsConnection.onmessage = this.onMessage.bind(this);
        }
    }

    onOpen() {
        console.log('open')
        this.sendLoginPacket()
    }

    onClose() {

    }

    onMessage(msg) {
        msg
    }
}