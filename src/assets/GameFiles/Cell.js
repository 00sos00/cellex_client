import * as PIXI from 'pixi.js-legacy';

export default class Cell {
    constructor(id, pID, x, y, s, color, flags, game) {
        this.id = id;
        this.pID = pID;
        this.x = x;
        this.y = y;
        this.s = s;
        this.nx = x;
        this.ny = y;
        this.ns = s;
        this.color = color;
        this.type = flags.isPlayer ? 'Player' : flags.isVirus ? 'Virus' : flags.isFood ? 'Food' : flags.isEjected ? 'Ejected' : flags.isMotherCell ? 'MotherCell' : 'Unknown';
        this.game = game;
        this.owner = this.game.playerManager.getPlayerById(this.pID);
        this.isMine = this.owner && this.owner.isMe;
        this.viewRange = 0;
        this.lastUpdateTime = 0;
        this.createSprite();
    }

    createSprite() {
        this.sprite = new PIXI.Sprite.from(this.game.scene.pixiLoader.resources[`${this.type}`].texture);
        this.nameSprite = this.createNameSprite();
        this.skinSprite = this.createSkinSprite();
        this.massText = this.createMassText();
        this.updateNameVisiblity();
        this.updateMassVisiblity();
        this.updateSkinVisiblity();
        if (this.owner) {
            this.skinSprite && this.sprite.addChild(this.skinSprite);
            this.nameSprite && this.sprite.addChild(this.nameSprite);
            this.massText && this.sprite.addChild(this.massText);
        }
        this.sprite.anchor.set(0.5);
        this.sprite.tint = '0x' + this.color.toHEX();
        this.game.scene.stage.addChild(this.sprite);
    }

    createSkinSprite() {
        if (this.owner && this.owner.cellTemplate.skinTexture) {
            let skinSprite = new PIXI.Sprite(this.owner.cellTemplate.skinTexture);
                skinSprite.anchor.set(0.5);
            return skinSprite;
        }
    }

    createNameSprite() {
        if (this.owner && this.owner.name) {
            let nameTexture = this.owner.cellTemplate.nameTexture;
            let nameSprite  = new PIXI.Sprite(nameTexture);
            nameSprite.anchor.set(0.5);
            return nameSprite;
        }
    }

    createMassText() {
        if (this.owner) {
            let massText = new PIXI.BitmapText('', {
                fontName: 'Mass'
            });
            massText.anchor.set(0.5, -1.2);
            return massText;
        }
    }

    createHatSprite() {

    }

    getMass() {
        return (this.s * this.s) / 100;
    }

    getShortMass() {
        const mass = Math.floor(this.getMass());
        return Math.abs(mass) >= 1000 ? (mass / 1000).toFixed(1) + 'k' : toString ? mass.toString() : mass;
    }

    update() {
        this.updateSprite();
        let shortMass = this.game.settings.template.options["Mass Type"].value == "SHORT";
        if (this.s != this.ns && this.massText)
            this.massText.text = shortMass ? this.getShortMass() : Math.floor(this.s * this.s / 100);
    }

    updateSprite() {
        let currentTime = Date.now();
        let animationDelay = this.game.settings.template.ranges['Animation Delay'].value;
        let dt = Math.max(Math.min((currentTime - this.lastUpdateTime) / animationDelay, 1), 0);
        this.x = this.x + (this.nx - this.x) * dt;
        this.y = this.y + (this.ny - this.y) * dt;
        this.s = this.s + (this.ns - this.s) * dt;
        if (this.sprite) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.width = this.s * 2;
            this.sprite.height = this.s * 2;
            this.sprite.zIndex = Math.floor(this.s * 2);
        }
        this.lastUpdateTime = currentTime;
    }

    updateVisiblity() {
        let noLag = this.game.settings.template.options["No Lag"].value == "ON";
        switch(this.type) {
            case 'Player': {
                if (this.owner && this.sprite) {
                    if (noLag && !this.isMine) 
                        this.sprite.tint = '0x' + 'ff071e';
                     else if (noLag && this.isMine)
                        this.sprite.tint = '0x' + '2596be';
                    this.updateNameVisiblity();
                    this.updateMassVisiblity();
                    this.updateSkinVisiblity();
                }
                break;
            }
            case 'Ejected': {
                this.sprite.tint = `0x${noLag ? 'ff071e' : this.color.toHEX()}`;
                break;
            }
            case 'Food': {
                let foodColor = this.game.settings.template.colors["Pellets"].value; foodColor
                let showPellets = this.game.settings.template.options["Pellets"].value == "SHOWN";
                let rainbowPellets = this.game.settings.template.options["Rainbow Pellets"].value == "ON";
                this.sprite.tint = `0x${rainbowPellets ? this.color.toHEX() : '494489'}`;
                this.sprite.visible = showPellets;
                break;
            }
        }
    }

    updateNameVisiblity() {
        let names = this.game.settings.template.options["Names"].value;
        let noLag = this.game.settings.template.options["No Lag"].value;
        if (names != "OFF" && noLag != "ON") {
            var _1 = (this.viewRange > 70 && names == "ALL" && this.owner.visibleCells.includes(this) && (this.isMine || !this.isMine));
            var _2 = (this.viewRange > 70 && names == "TAG" && this.owner.inTag && this.owner.visibleCells.includes(this));
            var _3 = (this.viewRange > 70 && names == "SELF" && this.isMine && this.owner.visibleCells.includes(this));
            var _4 = (this.viewRange > 70 && names == "HIDE SELF" && !this.isMine && this.owner.visibleCells.includes(this));
        }
        if (this.nameSprite) this.nameSprite.visible = _1 || _2 || _3 || _4;
    }

    updateMassVisiblity() {
        let mass = this.game.settings.template.options["Mass"].value;
        let noLag = this.game.settings.template.options["No Lag"].value;
        if (mass != "OFF" && noLag != "ON") {
            var _1 = (this.viewRange > 70 && mass == "ALL" && this.owner.visibleCells.includes(this) && (this.isMine || !this.isMine));
            var _2 = (this.viewRange > 70 && mass == "TAG" && this.owner.inTag && this.owner.visibleCells.includes(this));
            var _3 = (this.viewRange > 70 && mass == "SELF" && this.isMine && this.owner.visibleCells.includes(this));
            var _4 = (this.viewRange > 70 && mass == "HIDE SELF" && !this.isMine && this.owner.visibleCells.includes(this));
        }
        if (this.massText) this.massText.visible = _1 || _2 || _3 || _4;
    }

    updateHatVisiblity() {

    }

    updateSkinVisiblity() {
        let skins = this.game.settings.template.options["Skins"].value;
        let noLag = this.game.settings.template.options["No Lag"].value;
        if (skins != "OFF" && noLag != "ON") {
            var _1 = (skins == "ALL");
            var _2 = (skins == "TAG" && this.owner.inTag);
            var _3 = (skins == "SELF" && this.isMine);
            var _4 = (skins == "HIDE SELF" && !this.isMine);
        }
        if (this.skinSprite) this.skinSprite.visible = _1 || _2 || _3 || _4;
    }

    destroy() {
        if (this.game.gameCells.has(this.id))
            this.game.gameCells.delete(this.id);
        if (this.game.ownedCells.has(this.id))
            this.game.ownedCells.delete(this.id);
        if (this.game.playerCells.has(this.id))
            this.game.playerCells.delete(this.id);
        if (this.game.ejectedCells.has(this.id))
            this.game.ejectedCells.delete(this.id);
        if (this.game.foodCells.has(this.id))
            this.game.foodCells.delete(this.id);
        if (this.game.virusCells.has(this.id))
            this.game.virusCells.delete(this.id);
        if (this.game.motherCells.has(this.id))
            this.game.motherCells.delete(this.id);
        if (this.sprite)
            this.sprite.destroy();
    }
}