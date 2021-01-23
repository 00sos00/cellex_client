import * as PIXI from 'pixi.js-legacy';
import FontFaceObserver from 'fontfaceobserver';

export default class Scene {
    constructor(game, mainScene) {
        this.game = game;
        this.game.scene = this;
        this.app  = new PIXI.Application({
            resolution: 1,
            backgroundColor: 0x111111,
            antialias: true,
            autoStart: false,
            forceCanvas: false,
            resizeTo: window
        });
        this.prepareResources(mainScene);
    }
    
    lerp (start, end, amount) {
        return (1 - amount) * start + amount * end;
    }

    clearStage() {
        if (this.stage) this.stage.removeChildren();
    }

    mainLoop() {
        this.updateHUD();
        this.updateCamera();
        this.sendMousePosition();
        this.updateBackgroundColor();
        this.game.gameCells.forEach(cell => cell.update());
    }

    drawBorder() {
        const border = this.game.border;
        const borderGraphics = new PIXI.Graphics();
        const borderWidth = this.game.settings.template.ranges["Border Width"].value;
        const borderColor = this.game.settings.template.colors["Border"].value;
        const showBorder =  this.game.settings.template.options["Border"].value == "SHOWN";

        if (border && showBorder) {
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
        let mainStats = document.getElementById('mainStats');
        let mainLeaderboard = document.getElementById('mainLeaderboard');
        let mainMinimap = document.getElementById('mainMinimap');
        mainStats.style.display = showHUD ? '' : 'none';
        mainLeaderboard.style.display = showHUD ? '' : 'none';
        mainMinimap.style.display = showHUD ? '' : 'none';
        this.updateStats();
        this.updateLeaderboard();
        this.updateChat();
        this.updateMinimap();
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
        let leaderboard = this.game.leaderBoard;
        let lbElement = document.getElementById('leaderboardRows');
        let html = '';
        leaderboard.forEach((row, i) => {
            html += `<div class="lbRow ${row.isMe ? 'isMe' : ''}">${i}. ${row.name}</div>`
        });
        lbElement.innerHTML = html;
    }

    updateChat() {
        let mainChat = document.getElementById('mainChat');
        let messages = this.game.chat.messages;
        let messagesElement = document.getElementById('messages');
        let html = '';
        let showChat = this.game.settings.template.options["Chat"].value == "SHOWN";
        let showHUD = this.game.settings.template.options["HUD"].value == "SHOWN";
        messages.forEach(msg => {
            html += `<p class="message">${msg.name}: ${msg.text}</p>`
        });
        messagesElement.innerHTML = html;
        mainChat.style.display = showChat && showHUD ? 'block' : 'none'; 
    }

    updateMinimap() {
        let minimapCanvas = document.getElementById('minimapCanvas');
        let minimapSize = 200;
        let borderSize = (this.game.border.width + this.game.border.height) / 2;
        let ratio = borderSize / minimapSize;
        if (minimapCanvas) {
            minimapCanvas.width = minimapSize;
            minimapCanvas.height = minimapSize;
            let ctx = minimapCanvas.getContext('2d');
                ctx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height)
            this.game.playerManager.getAllPlayers().forEach(player => {
                if (player.inTag && (player.PLAY || (player.SPEC && player.isMe))) {
                    player.positionX = this.lerp(player.positionX, player.newPositionX, 0.2);
                    player.positionY = this.lerp(player.positionY, player.newPositionY, 0.2);
                    let x = player.positionX / ratio + borderSize / 2 / ratio;
                    let y = player.positionY / ratio + borderSize / 2 / ratio;
                    ctx.beginPath();
                        ctx.fillStyle = '#ffffff';
                        ctx.font = "15px Arial";
                        ctx.textAlign = "center";
                        player.isMe || ctx.fillText(player.name, x, y + 25);
                        ctx.fillStyle = player.isMe ? '#ffffff' : '#2596be';
                        ctx.arc(x, y, 5, 0, Math.PI * 2);
                        ctx.fill();
                    ctx.closePath();
                }
            });
        }
    }

    updateCamera() {
        let camera = this.game.camera;
        let cameraX = 0;
        let cameraY = 0;
        let cameraSpeed = this.game.settings.template.ranges["Camera Speed"].value;
        let autoZoom = this.game.settings.template.options["Auto Zoom"].value == "ON";
        let ownPlayer = this.game.playerManager.getOwnPlayer();
        if (this.game.ownedCells.size) {
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
            if (autoZoom && ownPlayer) camera.zoom = Math.pow(ownPlayer.size / ownPlayer.cellsAmount, .11) / 25;
            camera.scale = this.lerp(camera.scale, camera.zoom, 0.2);
        } else {
            camera.x = this.lerp(camera.x, camera.spectateX, cameraSpeed);
            camera.y = this.lerp(camera.y, camera.spectateY, cameraSpeed);
            camera.scale = this.lerp(camera.scale, camera.zoom, 0.2);
        } 
        this.stage.pivot.set(camera.x, camera.y);
        this.stage.scale.set(camera.scale);
        this.stage.position.set(this.view.width / 2, this.view.height / 2);
    }

    updateCameraScale(e) {
        if (window.canZoom) {
            let camera = this.game.camera;
            let zoomSpeed = this.game.settings.template.ranges["Zoom Speed"].value;
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
                    fontFamily: "Nunito",
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
            });
        });
    }
}