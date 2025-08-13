// @ts-nocheck
import { Person, Sample, Correlation } from "./stats.js";
import { Aldrin_Light } from "./aldrin-light.js";


const WIDTH = 200;
const HEIGHT = 200;

// canvas setup
const canvas = document.querySelector("canvas#c0");
canvas.width = WIDTH;
canvas.height = HEIGHT;

// aldrin light wasm setup
const aldrin_light = new Aldrin_Light();
window.onload = async () => {
    await aldrin_light.load_wasm("../wasm/aldrin-light.wasm");
    aldrin_light.set_canvas(canvas);

    clear();
}

// clear canvas
const clear = () => {
    aldrin_light.fill(0xcccccc);
    aldrin_light.display_canvas();
}

// statistics setup
const sample = new Sample("sample");
const correlation = new Correlation(sample);
let n = 0;
canvas.onclick = (e) => {
    // clear();
    const x = Math.min(e.offsetX, canvas.width - 1);
    const y = Math.min(e.offsetY, canvas.height - 1);
    aldrin_light.fill_ellipse(x, y, 2, 2, 0xcc00cc);
    aldrin_light.display_canvas();
    // const person = new Person(`p${n++}`);
    // person.set_variable("x", x);
    // person.set_variable("y", y);
    // sample.set_person(person);
    // const x_mean = sample.get_mean("x");
    // aldrin_light.aldrin_draw_line(ac, x_mean, 0, x_mean, 199, 0x00cc00);
    // const y_mean = sample.get_mean("y");
    // aldrin_light.aldrin_draw_line(ac, 0, y_mean, 199, y_mean, 0x00cc00);
    // console.log(correlation.get_coefficient("x", "y"));
    // for (const p of sample.people) {
    //     aldrin_light.aldrin_fill_ellipse(ac, p.variables["x"], p.variables["y"], 2, 2, 0x550055);
    // }
    // display_pixels(canvas, aldrin_light);
}