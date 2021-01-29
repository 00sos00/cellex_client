import * as PIXI from 'pixi.js-legacy';
import FontFaceObserver from 'fontfaceobserver';

export default class Scene {
    constructor(game, mainScene) {
        this.game = game;
        this.game.scene = this;
        this.app  = new PIXI.Application({
            resolution: 1,
            backgroundColor: 0x101010,
            antialias: true,
            autoStart: false,
            forceCanvas: false,
            resizeTo: window
        });
        this.prepareResources(mainScene);
        this.minimapCanvas = document.getElementById('minimapCanvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        this.minimapCanvas.width = 200;
        this.minimapCanvas.height = 200; 
        setInterval(() => {
            this.game.gameCells.forEach(cell => {
                cell.updateVisiblity();
            });
        }, 200);
    }
    
    lerp (start, end, amount) {
        return (1 - amount) * start + amount * end;
    }

    clearStage() {
        if (this.stage) this.stage.removeChildren();
    }

    mainLoop() {
        this.updateStats();
        this.updateMinimap();
        this.game.gameCells.forEach(cell => cell.update());
        this.updateCamera();
        this.sendMousePosition();
        this.updateBackgroundColor();
    }

    drawBorder() {
        const border = this.game.border;
        const borderWidth = this.game.settings.template.ranges["BorderWidth"].value;
        const borderColor = this.game.settings.template.colors["Border"].value;
        const showBorder =  this.game.settings.template.options["Border"].value == "SHOWN";

        if (border && showBorder) {
            const borderGraphics = new PIXI.Graphics();
            borderGraphics.lineStyle(borderWidth * 100, '0x' + borderColor)
               .moveTo(border.left, border.top)
               .lineTo(border.right, border.top)
               .lineTo(border.right, border.bottom)
               .lineTo(border.left, border.bottom)
               .lineTo(border.left, border.top);
            this.app.stage.addChild(borderGraphics);
        }
    }

    updateHUD() {
        let showHUD = this.game.settings.template.options["HUD"].value == "SHOWN";
        let showMinimap = this.game.settings.template.options["Minimap"].value == "SHOWN";
        let showChat = this.game.settings.template.options["Chat"].value == "SHOWN";
        document.getElementById('mainStats').style.display = showHUD ? '' : 'none';
        document.getElementById('mainLeaderboard').style.display = showHUD ? '' : 'none';
        document.getElementById('mainMinimap').style.display = showHUD && showMinimap ? '' : 'none';
        document.getElementById('mainChat').style.display = showHUD && showChat ? '' : 'none';
    }

    updateStats() {
        let ownPlayer = this.game.playerManager.getOwnPlayer();
        [...document.getElementsByClassName('statValue')].forEach(stat => {
            switch(stat.id) {
                case 'fps': {
                    stat.textContent = `FPS: ${Math.ceil(this.game.FPS)}`;
                    break;
                }
                case 'ping': {
                    stat.textContent = `Ping: ${this.game.Ping}`;
                    stat.parentElement.style.display = ownPlayer && ownPlayer.PLAY ? 'block' : 'none';
                    break;
                }
                case 'mass': {
                    if (ownPlayer)
                        stat.textContent = `Mass: ${ownPlayer.getMass()}`;
                    stat.parentElement.style.display = ownPlayer && ownPlayer.PLAY ? 'block' : 'none';
                    break;
                }
                case 'cells': {
                    if (ownPlayer)
                        stat.textContent = `Cells: ${ownPlayer.cellsAmount}/${ownPlayer.maxCells}`;
                    stat.parentElement.style.display = ownPlayer && ownPlayer.PLAY ? 'block' : 'none';
                    break;
                }
                default:
                    break;
            }
        });
    }

    updateLeaderboard() {
        let leaderboard = this.game.leaderBoard.list;
        let lbElement = document.getElementById('leaderboardRows');
        let html = '';
        leaderboard.forEach((row, i) => {
            html += `<div class="lbRow ${row.isMe ? 'isMe' : ''}">${i}. ${row.name}</div>`
        });
        lbElement.innerHTML = html;
    }

    updateChat() {
        let messages = this.game.chat.messages;
        let messagesElement = document.getElementById('messages');
        let html = '';
        let isScrollingChat = false;
        if (messagesElement.scrollHeight - (messagesElement.offsetHeight + messagesElement.scrollTop) < 1)
            isScrollingChat = false;
        else 
            isScrollingChat = true;
        messages.forEach(msg => {
            msg.text = msg.text.replace(/(<([^>]+)>)/ig, "");
            html += `<span class="message">
                        <span class="messageName">${msg.name}:</span>
                        <span class="messageText">${msg.text}</span>
                     </span>`;
        });
        messagesElement.innerHTML = html;
        if (!isScrollingChat)
            messagesElement.scrollTo(0, messagesElement.scrollHeight);
    }

    updateMinimap() {
        let minimapSize = 200;
        let borderSize = (this.game.border.width + this.game.border.height) / 2;
        let ratio = borderSize / minimapSize;
        if (this.minimapCanvas) {
                this.minimapCtx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height)
            this.game.playerManager.getAllPlayers().forEach(player => {
                if (player.inTag && (player.PLAY || (player.SPEC && player.isMe))) {
                    player.positionX = this.lerp(player.positionX, player.newPositionX, 0.2);
                    player.positionY = this.lerp(player.positionY, player.newPositionY, 0.2);
                    let x = player.positionX / ratio + borderSize / 2 / ratio;
                    let y = player.positionY / ratio + borderSize / 2 / ratio;
                    this.minimapCtx.beginPath();
                        this.minimapCtx.fillStyle = '#ffffff';
                        this.minimapCtx.font = "15px Arial";
                        this.minimapCtx.textAlign = "center";
                        player.isMe || this.minimapCtx.fillText(player.name, x, y + 25);
                        this.minimapCtx.fillStyle = player.isMe ? '#ffffff' : '#4480d4';
                        this.minimapCtx.arc(x, y, 5, 0, Math.PI * 2);
                        this.minimapCtx.fill();
                    this.minimapCtx.closePath();
                }
            });
        }
    }

    updateCamera() {
        let camera = this.game.camera;
        let cameraX = 0;
        let cameraY = 0;
        let cameraSpeed = this.game.settings.template.ranges["CameraSpeed"].value;
        let autoZoom = this.game.settings.template.options["AutoZoom"].value == "ON";
        let ownPlayer = this.game.playerManager.getOwnPlayer();
        if (ownPlayer && ownPlayer.PLAY && this.game.ownedCells.size) {
            let x = 0;
            let y = 0;
            this.game.ownedCells.forEach(cell => {
                x += cell.x;
                y += cell.y;
            });
            cameraX = x / this.game.ownedCells.size;
            cameraY = y / this.game.ownedCells.size;
            camera.x = this.lerp(camera.x, cameraX, cameraSpeed);
            camera.y = this.lerp(camera.y, cameraY, cameraSpeed);
            if (autoZoom) camera.zoom = Math.pow(ownPlayer.size / ownPlayer.cellsAmount / ownPlayer.size * 500, .11) / 25;
            camera.scale = this.lerp(camera.scale, camera.zoom, 0.2);
        } else if (ownPlayer && ownPlayer.SPEC) {
            camera.x = this.lerp(camera.x, camera.spectateX, 0.1);
            camera.y = this.lerp(camera.y, camera.spectateY, 0.1);
            camera.scale = this.lerp(camera.scale, camera.zoom, 0.2);
        } else {
            camera.x = this.lerp(camera.x, this.game.border.centerX, 0.1);
            camera.y = this.lerp(camera.y, this.game.border.centerY, 0.1);
            camera.zoom = 0.1;
        }
        this.stage.pivot.set(camera.x, camera.y);
        this.stage.scale.set(camera.scale);
        this.stage.position.set(this.view.width / 2, this.view.height / 2);
    }

    updateCameraScale(e) {
        if (window.canZoom) {
            let camera = this.game.camera;
            let zoomSpeed = this.game.settings.template.ranges["ZoomSpeed"].value;
            camera.zoom = e.deltaY > 0 ? camera.zoom / zoomSpeed : camera.zoom * zoomSpeed;
            camera.zoom = Math.max(Math.min(camera.zoom, 0.4), 0.03);
        }
    }

    onMouseMove(e) {
        this.game.mouse.x = e.clientX;
        this.game.mouse.y = e.clientY;
    }

    sendMousePosition() {
        let mouse = this.game.mouse;
        let camera = this.game.camera;
        let mouseX = (mouse.x - this.view.width / 2) / camera.scale + camera.x;
        let mouseY = (mouse.y - this.view.height / 2) / camera.scale + camera.y;
        if (this.game.socket.isConnectionOpen())
            this.game.socket.packetHandler.sendMouse(mouseX, mouseY);
    }

    updateBackgroundColor() {
        let backgroundColor = this.game.settings.template.colors["Background"].value;
        let webgl = this.renderer.type == 1;
        this.renderer.backgroundColor = `${webgl ? '0x' : ''}${backgroundColor}`;
    }

    prepareResources(mainScene) {
        this.pixiLoader = new PIXI.Loader();
        this.pixiLoader.add('Player',  require('../EntityTextures/Player.png'));
        this.pixiLoader.add('Ejected',  require('../EntityTextures/Ejected.png'));
        this.pixiLoader.add('Food',  require('../EntityTextures/Food.png'));
        this.pixiLoader.add('Virus',  require('../EntityTextures/Virus.png'));
        this.pixiLoader.add('MotherCell',  require('../EntityTextures/MotherCell.png'));
        this.pixiLoader.load(() => {
            const font = new FontFaceObserver('Nunito');

            font.load().then(() => {
                PIXI.BitmapFont.from("Mass", {
                    fontFamily: "Quicksand",
                    fontSize: 45,
                    strokeThickness: 6,
                    fill: 0xffffff
                }, {
                    chars: PIXI.BitmapFont.ASCII,
                    resolution: 2
                });
                this.renderer = this.app.renderer;
                this.ticker = this.app.ticker;
                this.stage = this.app.stage;
                this.view = this.app.view;
                this.stage.sortableChildren = true;
                this.ticker.add(this.mainLoop.bind(this));
                window.onwheel = this.updateCameraScale.bind(this);
                window.onmousemove = this.onMouseMove.bind(this);
                mainScene.appendChild(this.app.view);
                this.game.socket.connect('antha.run-eu-central1.goorm.io');
            });
        });
    }
}