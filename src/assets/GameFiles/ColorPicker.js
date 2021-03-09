export default class ColorPicker {
    constructor(rInput, gInput, bInput, hexInput, colorSqaure, hexColor, game, name) {
        this.rInput = rInput;
        this.gInput = gInput;
        this.bInput = bInput;
        this.hexInput = hexInput;
        this.colorSqaure = colorSqaure;
        this.rgb = {
            r: rInput.value,
            g: gInput.value,
            b: bInput.value
        }
        this.hex = hexInput.value;
        this.game = game;
        this.name = name;
        this.createListeners();
        this.initHexColor(hexColor)
    }

    initHexColor(hex) {
        hex = "#" + hex;
        this.updateHex(hex);
        this.rgb = this.hexToRGB(hex);
        this.updateRGB();
        this.updateColorSqaure();
    }

    hexToRGB(hex) {
        hex = hex.replace('#', '');

        let rgb = {
            r: `0x${hex[0] + hex[1]}`,
            g: `0x${hex[2] + hex[3]}`,
            b: `0x${hex[4] + hex[5]}`,
        }

        rgb.r = parseInt(rgb.r, 16);
        rgb.g = parseInt(rgb.g, 16);
        rgb.b = parseInt(rgb.b, 16);

        return rgb;
    }
      
    rgbToHex(rgb) {
        // Get RGB Properties
        let r = parseInt(rgb.r, 10),
            g = parseInt(rgb.g, 10), 
            b = parseInt(rgb.b, 10);

        // Convert them to hex
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }

    updateHex(hex) {
        this.hex = hex || this.rgbToHex(this.rgb);
        this.hexInput.value = this.hex;
    }

    updateRGB() {
        this.rInput.value = this.rgb.r;
        this.gInput.value = this.rgb.g;
        this.bInput.value = this.rgb.b;
    }

    updateColorSqaure() {
        this.colorSqaure.style.backgroundColor = this.hex;
    }

    saveHex() {
        let hex = this.hex.replace('#', '');
        this.game.settings.onColorChange(this.name, hex);
    }

    createListeners() {
        // R
        this.rInput.oninput = (e) => {
            this.rgb.r = e.target.value;
            this.updateHex();
            this.updateColorSqaure();
            this.saveHex();
        }

        // G
        this.gInput.oninput = (e) => {
            this.rgb.g = e.target.value;
            this.updateHex();
            this.updateColorSqaure();
            this.saveHex();
        }

        // B
        this.bInput.oninput = (e) => {
            this.rgb.b = e.target.value;
            this.updateHex();
            this.updateColorSqaure();
            this.saveHex();
        }

        // HEX
        this.hexInput.oninput = (e) => {
            this.rgb = this.hexToRGB(e.target.value);
            this.updateRGB();
            this.updateHex();
            this.updateColorSqaure();
            this.saveHex();
        }
    }
}