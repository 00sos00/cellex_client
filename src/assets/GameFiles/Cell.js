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
        this.type = flags.isPlayer ? 'Player' : flags.isVirus ? 'Virus' : flags.isFood ? 'Food' : flags.isEjected ? 'Ejected' : flags.isMotherCell ? 'MotherCell' : flags.isGhostCell ? 'GhostCell' : 'Unknown';
        this.game = game;
        this.owner = this.game.playerManager.getPlayerById(this.pID);
        this.isMine = this.owner && this.owner.isMe;
        this.viewRange = 0;
        this.lastUpdateTime = 0;
        this.createSprite();
    }


    /* <=== Useful Functions */


    getMass() {
        return Math.floor(this.s * this.s / 100);
    }

    getShortMass() {
        const mass = this.getMass();
        return Math.abs(mass) >= 1000 ? (mass / 1000).toFixed(1) + 'k' : toString ? mass.toString() : mass;
    }


    /* <=== Create Sprites ===> */


    createSprite() {
        this.sprite = new PIXI.Sprite.from(this.game.scene.pixiLoader.resources[`${this.type}`].texture);
        if (this.owner) {
            this.nameSprite = this.createNameSprite();
            this.skinSprite = this.createSkinSprite();
            this.massText   = this.createMassText();
        }
        this.sprite.tint = '0x' + this.color.toHEX();
        this.sprite.anchor.set(0.5);
        this.updateVisiblity();
        this.skinSprite && this.sprite.addChild(this.skinSprite);
        this.nameSprite && this.sprite.addChild(this.nameSprite);
        this.massText && this.sprite.addChild(this.massText);
        this.game.scene.stage.addChild(this.sprite);
    }

    createNameSprite() {
        const nameTexture = this.owner.cellTemplate.nameTexture;
        if (!nameTexture) 
            return;
        const nameSprite = new PIXI.Sprite(nameTexture);
              nameSprite.anchor.set(0.5);
        return nameSprite;
    }

    createMassText() {
        const massText = new PIXI.BitmapText('', { fontName: 'Mass' });
              massText.anchor.set(0.5, -1.2);
        return massText;
    }

    createSkinSprite() {
        const skinTexture = this.owner.cellTemplate.skinTexture;
        const skinSprite = new PIXI.Sprite();
              skinSprite.anchor.set(0.5);
        if (skinTexture)
              skinSprite.texture = skinTexture;
        return skinSprite;
    }


    /* <=== Update Cell ===> */


    update() {
        const currentTime = Date.now();
        const animationDelay = this.game.settings.template.ranges['AnimationDelay'].value;
        const ShortMass = this.game.settings.template.options["MassType"].value == "SHORT";
        const dt = Math.max(Math.min((currentTime - this.lastUpdateTime) / animationDelay, 1), 0);
        this.x = this.x + (this.nx - this.x) * dt;
        this.y = this.y + (this.ny - this.y) * dt;
        this.s = this.s + (this.ns - this.s) * 0.2;
        if (this.sprite) {
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            this.sprite.width = this.s * 2;
            this.sprite.height = this.s * 2;
            this.sprite.zIndex = Math.floor(this.s * 2);
        }
        if (this.s != this.ns && this.massText)
            this.massText.text = ShortMass ? this.getShortMass() : this.getMass();
        this.lastUpdateTime = currentTime;
    }

    updateVisiblity() {
        /* <=== Options ===> */
        const NoLag = this.game.settings.template.options["NoLag"].value == "ON";
        const Names = this.game.settings.template.options["Names"].value;
        const Skins = this.game.settings.template.options["Skins"].value;
        const Mass = this.game.settings.template.options["Mass"].value;
        const Food = this.game.settings.template.options["Food"].value == "SHOWN";
        const RainbowFood = this.game.settings.template.options["RainbowFood"].value == "ON";

        /* <=== Colors ===> */
        const FoodColor = this.game.settings.template.colors["Food"].value;
        const VirusColor = this.game.settings.template.colors["Virus"].value;
        const MotherCellColor = this.game.settings.template.colors["MotherCell"].value;
        const NoLagCellsColor = this.game.settings.template.colors["NoLagCells"].value;
        const NoLagCellsOwnColor = this.game.settings.template.colors["NoLagCellsOwn"].value;

        switch(this.type) {
            case 'Player': {
                if (this.owner) {
                    /* <=== Names ===> */
                    const namesCondition1 = this.viewRange > 70 && Names == "ALL" && this.owner.visibleCells.includes(this) && (this.isMine || !this.isMine);
                    const namesCondition2 = this.viewRange > 70 && Names == "TAG" && this.owner.visibleCells.includes(this) && this.owner.inTag;
                    const namesCondition3 = this.viewRange > 70 && Names == "SELF" && this.owner.visibleCells.includes(this) && this.isMine;
                    const namesCondition4 = this.viewRange > 70 && Names == "HIDE SELF" && this.owner.visibleCells.includes(this) && !this.isMine;
                    if (this.nameSprite) 
                        this.nameSprite.visible = (namesCondition1 || namesCondition2 || namesCondition3 || namesCondition4) && !NoLag;

                    /* <=== Skins ===> */
                    const skinsCondition1 = Skins == "ALL";
                    const skinsCondition2 = Skins == "TAG" && this.owner.inTag;
                    const skinsCondition3 = Skins == "SELF" && this.isMine;
                    const skinsCondition4 = Skins == "HIDE SELF" && !this.isMine;
                    if (this.skinSprite) 
                        this.skinSprite.visible = (skinsCondition1 || skinsCondition2 || skinsCondition3 || skinsCondition4) && !NoLag;

                    /* <=== Mass ===> */
                    const massCondition1 = this.viewRange > 70 && Mass == "ALL" && this.owner.visibleCells.includes(this) && (this.isMine || !this.isMine);
                    const massCondition2 = this.viewRange > 70 && Mass == "TAG" && this.owner.visibleCells.includes(this) && this.owner.inTag;
                    const massCondition3 = this.viewRange > 70 && Mass == "SELF" && this.owner.visibleCells.includes(this) && this.isMine;
                    const massCondition4 = this.viewRange > 70 && Mass == "HIDE SELF" && this.owner.visibleCells.includes(this) && !this.isMine;
                    if (this.massText) 
                        this.massText.visible = (massCondition1 || massCondition2 || massCondition3 || massCondition4) && !NoLag;

                    /* <=== No Lag ===> */
                    if (NoLag && this.sprite)
                        this.sprite.tint = `0x${this.isMine ? NoLagCellsOwnColor : NoLagCellsColor}`;
                    else if (this.sprite)
                        this.sprite.tint = `0x${this.color.toHEX()}`;
                }

                break;
            }
            case 'Ejected': {
                if (this.sprite)
                    this.sprite.tint = `0x${NoLag ? NoLagCellsColor : this.color.toHEX()}`;
                break;
            }
            case 'Food': {
                if (this.sprite) {
                    this.sprite.tint = `0x${RainbowFood ? this.color.toHEX() : FoodColor}`;
                    this.sprite.visible = Food;
                }
                break;
            }
            case 'Virus': {
                if (this.sprite)
                    this.sprite.tint = `0x${VirusColor}`;
                break;
            }
            case 'MotherCell': {
                if (this.sprite)
                    this.sprite.tint = `0x${MotherCellColor}`;
                break;
            }
            case 'GhostCell': {
                if (this.skinSprite)
                    this.skinSprite.visible = false;
                if (this.nameSprite)
                    this.nameSprite.visible = false;
                if (this.massText)
                    this.massText.visible = false;
                if (this.sprite)
                    this.sprite.tint = '0x202020';
                    this.sprite.alpha = 0.5;
                break;
            }
        }
    }


    /* <=== Destroy Cell ===> */


    destroy() {
        this.game.gameCells.delete(this.id);
        this.game.ownedCells.delete(this.id);
        this.game.playerCells.delete(this.id);
        this.game.ejectedCells.delete(this.id);
        this.game.foodCells.delete(this.id);
        this.game.virusCells.delete(this.id);
        this.game.motherCells.delete(this.id);
        this.sprite && this.sprite.destroy();
    }
}