import { Aldrin_Light } from "./aldrin-light.js";
import { Person, Sample, Correlation, Regression } from "./stats.js";
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
};
// clear canvas
const clear = () => {
    aldrin_light.fill(0xcccccc);
    aldrin_light.display_canvas();
};
// statistics setup
const sample = new Sample("sample");
const correlation = new Correlation(sample);
const pearson_r_div = document.querySelector("div#pearson-r");
const regression = new Regression(sample);
const regression_line_div = document.querySelector("div#regression-line");
let n = 0;
canvas.onclick = (e) => {
    // get person scores
    const x = Math.min(e.offsetX, WIDTH - 1);
    const y = Math.min(e.offsetY, HEIGHT - 1);
    // create new person into the sample
    const person = new Person(`p${n++}`);
    person.set_variable("x", x);
    person.set_variable("y", y);
    sample.add_person(person);
    // calculate correlation coefficient
    const pearson_r = correlation.get_coefficient("x", "y");
    pearson_r_div.innerText = `Pearson's r = ${pearson_r}`;
    // calculate regression line y=m*x+c and two coordinates on the canvas
    const { m, c } = regression.get_line("x", "y");
    regression_line_div.innerText = `Regression line: Y=${m}X+${c}`;
    // draw on canvas and display
    clear();
    for (const p of sample.people) {
        aldrin_light.fill_ellipse(p.variables["x"], p.variables["y"], 2, 2, 0x550055);
    }
    const x_mean = sample.get_mean("x");
    aldrin_light.draw_line(x_mean, 0, x_mean, 199, 0x00cc00);
    const y_mean = sample.get_mean("y");
    aldrin_light.draw_line(0, y_mean, 199, y_mean, 0x00cc00);
    aldrin_light.draw_line_from_equation(m, c, 0xcc00000);
    aldrin_light.display_canvas();
};
