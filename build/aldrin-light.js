export const aldrin_light_env = {
    round: Math.round,
    sqrt: Math.sqrt,
    pow: Math.pow
};
export class Aldrin_Canvas {
}
export class Aldrin_Light {
    constructor() {
        this.load_wasm = async (wasm_url, env = {}) => {
            this.wasm = await WebAssembly.instantiateStreaming(fetch(wasm_url), { env: Object.assign(Object.assign({}, aldrin_light_env), env) });
            this.exports_ = this.wasm.instance.exports;
            this.ac = this.exports_.ac;
            this.width = this.get_width();
            this.height = this.get_height();
        };
        // library functions
        this.put_pixel = (x, y, color) => {
            return this.exports_.aldrin_put_pixel(this.ac, x, y, color);
        };
        this.fill = (color) => {
            return this.exports_.aldrin_fill(this.ac, color);
        };
        this.draw_line = (x0, y0, x1, y1, color) => {
            return this.exports_.aldrin_draw_line(this.ac, x0, y0, x1, y1, color);
        };
        this.fill_triangle = (x0, y0, x1, y1, x2, y2, color) => {
            return this.exports_.aldrin_fill_triangle(this.ac, x0, y0, x1, y1, x2, y2, color);
        };
        this.draw_ellipse = (x, y, r0, r1, color) => {
            return this.exports_.aldrin_draw_ellipse(this.ac, x, y, r0, r1, color);
        };
        this.fill_ellipse = (x, y, r0, r1, color) => {
            return this.exports_.aldrin_fill_ellipse(this.ac, x, y, r0, r1, color);
        };
        this.get_pixels = () => {
            const ptr = this.exports_.aldrin_get_pixels(this.ac);
            const buffer = this.exports_.memory.buffer;
            const pixels = new Uint8Array(buffer, ptr, this.width * this.height * 4);
            return pixels;
        };
        this.get_width = () => {
            return this.exports_.aldrin_get_width(this.ac);
        };
        this.get_height = () => {
            return this.exports_.aldrin_get_height(this.ac);
        };
        // canvas element
        this.set_canvas = (html_canvas) => {
            this.html_canvas = html_canvas;
        };
        this.display_canvas = () => {
            const ctx = this.html_canvas.getContext("2d", { willReadFrequently: true });
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, this.width, this.height);
            const img = ctx.getImageData(0, 0, this.width, this.height);
            const img_px = img.data;
            const pixels = this.get_pixels();
            for (let i = 0; i < img_px.length; i += 4) {
                /*
                    in C, color codes are stored reversed
                    e.g., 0xff00ff00 becomes 0x00ff00ff
                    so, reverse it here
                */
                img_px[i] = pixels[i + 2]; // r
                img_px[i + 1] = pixels[i + 1]; // g
                img_px[i + 2] = pixels[i]; // b 
                img_px[i + 3] = 255; // a
            }
            ctx.putImageData(img, 0, 0);
        };
    }
}
