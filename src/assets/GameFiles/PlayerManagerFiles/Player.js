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
        if (this.isMe && !this.game.mainOpen && this.size <= 0 && !this.SPEC)
            this.game.showMain();
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

    cacheNameText() {
        let renderTexture = PIXI.RenderTexture.create(612, 200);
        let text = new PIXI.Text(this.name, {
            fontFamily: "Nunito",
            fontSize: 80,
            stroke: true,
            strokeThickness: 7,
            fill: 0xffffff,
            align: 'center'
        });
        text.resolution = 2;
        text.anchor.set(0.5);
        text.position.set(306, 100);
        this.game.scene.renderer.render(text, renderTexture);
        if (this.cellTemplate.nameTexture)
            this.cellTemplate.nameTexture.destroy();
        this.cellTemplate.nameTexture = renderTexture;
    }

    cacheSkin() {
        if (this.skinCode) {
            let skinSprite = new PIXI.Sprite.from(`https://i.imgur.com/${this.skinCode}.png`);
            let graphics = new PIXI.Graphics().beginFill(0xffffff).drawCircle(256, 256, 256).endFill();
            skinSprite.mask = graphics;
            this.cellTemplate.skinTexture = skinSprite.texture;
        }
    }
}