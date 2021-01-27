export default class HotkeysHandler {
    constructor(game) {
        this.game = game;
        window.onkeydown   = this.onKeyDown.bind(this);
        window.onkeyup     = this.onKeyUp.bind(this);
        window.onmousedown = this.onMouseDown.bind(this);
        window.onmouseup   = this.onMouseUp.bind(this);
    }

    onKeyDown(e) {
        this.hotkeys = this.game.settings.template.hotkeys;
        if (this.game.mainOpen || window.isTyping) return;
        switch(e.code) {
            case this.hotkeys["Feed"].value: {
                this.game.socket.packetHandler.startFeeding();
                break;
            }
            case this.hotkeys["Split"].value: {
                !e.repeat && this.game.socket.packetHandler.split();
                break;
            }
            case this.hotkeys["Doublesplit"].value: {
                !e.repeat && this.game.socket.packetHandler.doublesplit();
                break;
            }
            case this.hotkeys["Triplesplit"].value: {
                !e.repeat && this.game.socket.packetHandler.triplesplit();
                break;
            }
            case this.hotkeys["Split16"].value: {
                !e.repeat && this.game.socket.packetHandler.split16();
                break;
            }
            case this.hotkeys["Respawn"].value: {
                this.game.socket.packetHandler.respawn();
                this.game.joinGame();
                break;
            }
            case this.hotkeys["Toggle Menu"].value: {
                !e.repeat && this.game.showMain();
                !e.repeat && this.game.socket.packetHandler.stopSpectating();
                break;
            }
            default:
                break;
        }
    }

    onKeyUp(e) {
        switch(e.code) {
            case this.hotkeys["Feed"].value: {
                this.game.socket.packetHandler.stopFeeding();
                break;
            }
            case "Enter": {
                let chatInput = document.getElementById('chatInput');
                if (document.activeElement == chatInput) {
                    let message = chatInput.value;
                    this.game.socket.packetHandler.sendChatMessage(message);
                    chatInput.blur();
                    chatInput.value = '';
                } else {
                    !this.game.mainOpen && chatInput.focus();
                }
                break;
            }
            default:
                break;
        }
    }

    onMouseDown(e) {
        this.hotkeys = this.game.settings.template.hotkeys;
        if (this.game.mainOpen || window.isTyping) return;
        switch(e.which) {
            case parseInt(this.hotkeys["Feed"].value[5], 10): {
                this.game.socket.packetHandler.startFeeding();
                break;
            }
            case parseInt(this.hotkeys["Split"].value[5], 10): {
                this.game.socket.packetHandler.split();
                break;
            }
            case parseInt(this.hotkeys["Doublesplit"].value[5], 10): {
                this.game.socket.packetHandler.doublesplit();
                break;
            }
            case parseInt(this.hotkeys["Triplesplit"].value[5], 10): {
                this.game.socket.packetHandler.triplesplit();
                break;
            }
            case parseInt(this.hotkeys["Split16"].value[5], 10): {
                this.game.socket.packetHandler.split16();
                break;
            }
            case parseInt(this.hotkeys["Respawn"].value[5], 10): {
                this.game.socket.packetHandler.respawn();
                this.game.joinGame();
                break;
            }
            default:
                break;
        }
    }

    onMouseUp(e) {
        switch(e.which) {
            case parseInt(this.hotkeys["Feed"].value[5], 10): {
                this.game.socket.packetHandler.stopFeeding();
                break;
            }
            default:
                break;
        }
    }
}