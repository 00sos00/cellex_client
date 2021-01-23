/* import { load } from 'nsfwjs'; */

export default class SkinChanger {
    constructor(game, EventHandler, defaultSkinCode) {
        this.game = game;
        this.game.skinChanger = this;
        this.EventHandler = EventHandler;
        this.skinCode = '';
        this.lastSkinCode = localStorage.getItem('skinCode') || '';
        this.defaultSkinCode = defaultSkinCode;
        /* load().then(model => {
            this.nsfwjsModel = model;
        }); */
    }

    setSkinCode(code) {
        this.skinCode = code;
    }

    addErrorMessage(errorMessage) {
        document.getElementById('errorMessage').innerText = errorMessage;
    }

    removeErrors() {
        document.getElementById('errorMessage').innerText = '';
    }

    updateImageElements(skinCode) {
        const imageElements = Array.from(document.getElementsByClassName('skinImage'));
        imageElements.forEach(elem => {
            elem.src = `https://i.imgur.com/${skinCode}.png`;
        });
    }

    onSkinCodeChange(e) {
        this.setSkinCode(e.target.value);
        this.checkSkin().then(isValid => {
            if (isValid)
                this.updateImageElements(this.skinCode);
        });
    }

    checkSkin() {
        return new Promise(resolve => {
            // Check if skin code is valid
            const imgurRegex = /^https?:\/\/(\w+\.)?imgur.com\/(\w*\d\w*)+(\.[a-zA-Z]{3})?$/g;
            const isValidSkin = imgurRegex.test(`https://i.imgur.com/${this.skinCode}.png`);

            if (!this.skinCode || this.skinCode.length != 7 || !isValidSkin || this.skinCode == this.lastSkinCode)
                resolve(false);
            else
                resolve(true);
        });
    }

    saveSkin(e) {
        this.checkSkin().then(isValid => {
            if (!isValid) {
                this.addErrorMessage('Please Use A Different Skin Code');
            } else {
                this.removeErrors();
                e.target.classList.add('saveBtnLoading');
                e.target.disabled = true;
                this.lastSkinCode = this.skinCode;
                this.game.socket.packetHandler.sendSkin(this.skinCode);
                localStorage.setItem('skinCode', this.skinCode);
                setTimeout(() => {
                    e.target.disabled = false;
                    e.target.classList.remove('saveBtnLoading');
                    this.EventHandler.emit('closeSkinChanger');
                }, 3000);
            }
        });
    }

    closeSkinChanger() {
        this.removeErrors();
        this.updateImageElements(this.lastSkinCode || this.defaultSkinCode);
        document.getElementById('skinCode').value = this.lastSkinCode || this.skinCode;
        this.EventHandler.emit('closeSkinChanger');
    }

    onMounted() {
        document.getElementById('skinCode').value = this.lastSkinCode || this.skinCode;
        this.setSkinCode(localStorage.getItem('skinCode') || this.skinCode);
        this.checkSkin().then(isValid => {
            if (isValid) {
                this.updateImageElements(this.skinCode);
            } else {
                this.updateImageElements(this.lastSkinCode || this.defaultSkinCode);
            }
        });
    }
}