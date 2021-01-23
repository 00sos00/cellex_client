export default class Color {
    constructor(type, rgb = {r: 0, g: 0, b: 0}, hex = '000000') {
        this.type = type;
        this.color = type === 'rgb' ? rgb : hex;
    }

    toHEX() {
        return `${(1 << 24 | this.color.r << 16 | this.color.g << 8 | this.color.b).toString(16).slice(1)}`;
    }

    toRGB() {
        let r = Number(this.color.r).toString(16),
            g = Number(this.color.g).toString(16),
            b = Number(this.color.b).toString(16);
        if (r.length < 2) {
            r = "0" + r;
        } else if (g.length < 2) {
            g = "0" + g;
        } else if (b.length < 2) {
            b = "0" + b;
        }
        return {r, g ,b};
    }

    clone() {
        return new Color(this.type, this.color, this.color);
    }
}