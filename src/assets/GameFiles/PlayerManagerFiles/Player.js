import * as PIXI from 'pixi.js-legacy';

export default class Player {
    constructor(data, game) {
        this.id = data.id;
        this.name = data.name;
        this.skinCode = data.skinCode;
        this.inTag = data.inTag;
        this.isMe = data.isMe;
        this.positionX = data.playerX;
        this.positionY = data.playerY;
        this.newPositionX = data.playerX;
        this.newPositionY = data.playerY;
        this.size = data.playerS;
        this.cellsAmount = data.cellsAmount;
        this.maxCells = data.maxCells;
        this.IDLE = data.IDLE;
        this.SPEC = data.SPEC;
        this.PLAY = data.PLAY;
        this.game = game;
        this.cellTemplate = {
            skinTexture: null,
            hatTexture: null,
            nameTexture: null
        }
        this.visibleCells = [];
    }

    update(data) {
        this.name = data.name;
        this.skinCode = data.skinCode;
        this.inTag = data.inTag;
        this.isMe = data.isMe;
        this.newPositionX = data.playerX;
        this.newPositionY = data.playerY;
        this.size = data.playerS;
        this.cellsAmount = data.cellsAmount;
        this.maxCells = data.maxCells;
        this.IDLE = data.IDLE;
        this.SPEC = data.SPEC;
        this.PLAY = data.PLAY;
        this.updateVisibleCells();
    }

    getMass() {
        let size = Math.floor(this.size);
        return Math.abs(size) >= 1000 ? (size / 1000).toFixed(1) + 'k' : toString ? size.toString() : size;
    }

    updateVisibleCells() {
        if (this.PLAY) {
            let cells = [];
            this.game.playerCells.forEach(cell => {
                if (cell.owner == this)
                    cells.push(cell);
            });
            cells.sort((a, b) => b.getMass() - a.getMass());
            this.visibleCells = []
            for (let i = 0; i < 64; i++)
                if (cells[i]) this.visibleCells.push(cells[i]);
        }
    }

    cacheNameText(name) {
        let renderTexture = PIXI.RenderTexture.create(612, 200);
        let text = new PIXI.Text(name || this.name, {
            fontFamily: "Quicksand",
            fontSize: 80,
            stroke: true,
            strokeThickness: 7,
            fill: 0xffffff,
            align: 'center'
        });
        text.resolution = 2;
        text.anchor.set(0.5);
        text.position.set(306, 100);
        if (this.game.scene.renderer)
            this.game.scene.renderer.render(text, renderTexture);
        else
            return;
        if (this.cellTemplate.nameTexture)
            this.cellTemplate.nameTexture.destroy();
        this.cellTemplate.nameTexture = renderTexture;
    }

    cacheSkin(skinCode) {
        if (skinCode || this.skinCode) {
            let skinSprite = new PIXI.Sprite.from(`https://i.imgur.com/${skinCode || this.skinCode}.png`);
                skinSprite.width = 512;
                skinSprite.height = 512;
                skinSprite.anchor.set(0.5);
                skinSprite.mask = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 256).endFill();
            setTimeout(() => {
                this.cellTemplate.skinTexture = this.game.scene.renderer.generateTexture(skinSprite);
            }, 100);
        }
    }
}