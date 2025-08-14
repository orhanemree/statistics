export const aldrin_light_env = {
    round: Math.round,
    sqrt: Math.sqrt,
    pow: Math.pow
}

export class Aldrin_Canvas {}

export interface Aldrin_Light_Exports {
    ac: Aldrin_Canvas;
    memory: WebAssembly.Memory;
    aldrin_put_pixel: (ac: Aldrin_Canvas, x: number, y: number, color: number) => void;
    aldrin_fill: (ac: Aldrin_Canvas, color: number) => void;
    aldrin_draw_line: (ac: Aldrin_Canvas, x0: number, y0: number, x1: number, y1: number, color: number) => void;
    aldrin_fill_triangle: (ac: Aldrin_Canvas, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: number) => void;
    aldrin_draw_ellipse: (ac: Aldrin_Canvas, x: number, y: number, r0: number, r1: number, color: number) => void;
    aldrin_fill_ellipse: (ac: Aldrin_Canvas, x: number, y: number, r0: number, r1: number, color: number) => void;
    aldrin_get_pixels: (ac: Aldrin_Canvas) => number;
    aldrin_get_width: (ac: Aldrin_Canvas) => number;
    aldrin_get_height: (ac: Aldrin_Canvas) => number;
}

export class Aldrin_Light {
    wasm: WebAssembly.WebAssemblyInstantiatedSource;
    exports_: Aldrin_Light_Exports;
    ac: Aldrin_Canvas;
    width: number;
    height: number;
    html_canvas: HTMLCanvasElement;

    constructor() {
    }

    load_wasm = async (wasm_url: string, env={}) => {
        const abs_url = new URL(wasm_url, import.meta.url);
        this.wasm = await WebAssembly.instantiateStreaming(
            fetch(abs_url),
            { env: { ...aldrin_light_env, ...env } }
        );
        this.exports_ = this.wasm.instance.exports as unknown as Aldrin_Light_Exports;
        this.ac = this.exports_.ac;
        this.width = this.get_width();
        this.height = this.get_height();
    }

    // library functions
    put_pixel = (x: number, y: number, color: number) => {
        return this.exports_.aldrin_put_pixel(this.ac, x, y, color);
    }

    fill = (color: number) => {
        return this.exports_.aldrin_fill(this.ac, color);
    }

    draw_line = (x0: number, y0: number, x1: number, y1: number, color: number) => {
        return this.exports_.aldrin_draw_line(this.ac, x0, y0, x1, y1, color);
    }

    fill_triangle = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: number) => {
        return this.exports_.aldrin_fill_triangle(this.ac, x0, y0, x1, y1, x2, y2, color);
    }

    draw_ellipse = (x: number, y: number, r0: number, r1: number, color: number) => {
        return this.exports_.aldrin_draw_ellipse(this.ac, x, y, r0, r1, color);
    }

    fill_ellipse = (x: number, y: number, r0: number, r1: number, color: number) => {
        return this.exports_.aldrin_fill_ellipse(this.ac, x, y, r0, r1, color);
    }

    get_pixels = () => {
        const ptr = this.exports_.aldrin_get_pixels(this.ac);
        const buffer = this.exports_.memory.buffer;
        const pixels = new Uint8Array(buffer, ptr, this.width*this.height*4);
        return pixels;
    }

    get_width = (): number => {
        return this.exports_.aldrin_get_width(this.ac);
    }

    get_height = (): number => {
        return this.exports_.aldrin_get_height(this.ac);
    }

    // canvas element
    set_canvas = (html_canvas: HTMLCanvasElement) => {
        this.html_canvas = html_canvas;
    }

    display_canvas = () => {
        const ctx = this.html_canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
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
            img_px[i] = pixels[i + 2]     // r
            img_px[i + 1] = pixels[i + 1] // g
            img_px[i + 2] = pixels[i]     // b 
            img_px[i + 3] = 255           // a
        }

        ctx.putImageData(img, 0, 0);
    }
}