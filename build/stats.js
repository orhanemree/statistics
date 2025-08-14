export class Person {
    constructor(name) {
        this.set_variable = (key, value) => {
            this.variables[key] = value;
        };
        this.name = name;
        this.variables = {};
    }
}
export class Sample {
    constructor(name) {
        this.add_person = (person) => {
            this.people.push(person);
        };
        this.get_mean = (variable_key) => {
            // get mean of a particular variable
            let sum = 0;
            for (const p of this.people) {
                sum += p.variables[variable_key];
            }
            return sum / this.people.length;
        };
        this.get_variance = (variable_key) => {
            // get variance of a particular variable
            const mean = this.get_mean(variable_key);
            let ss = 0;
            for (const p of this.people) {
                // calculate deviation
                const dev = p.variables[variable_key] - mean;
                ss += dev * dev;
            }
            return ss / this.people.length;
        };
        this.get_standard_deviation = (variable_key) => {
            // get standard deviation of a particular variable
            const variance = this.get_variance(variable_key);
            return Math.sqrt(variance);
        };
        this.get_scores = (variable_key) => {
            // get scores list of a particular variable
            const scores = [];
            for (const p of this.people) {
                scores.push(p.variables[variable_key]);
            }
            return scores;
        };
        this.get_z_scores = (variable_key) => {
            // get x scores list of raw scores of a particular variable
            const scores = this.get_scores(variable_key);
            const z_scores = [];
            const mean = this.get_mean(variable_key);
            const sdev = this.get_standard_deviation(variable_key);
            for (const s of scores) {
                if (sdev == 0) {
                    // 0 is preferred over NaN
                    z_scores.push(0);
                    continue;
                }
                const z = (s - mean) / sdev;
                z_scores.push(z);
            }
            return z_scores;
        };
        this.name = name;
        this.people = [];
    }
}
export class Correlation {
    constructor(sample) {
        this.get_coefficient = (x_key, y_key) => {
            const xz = this.sample.get_z_scores(x_key);
            const yz = this.sample.get_z_scores(y_key);
            const len = xz.length;
            let sum = 0;
            for (let i = 0; i < len; ++i) {
                sum += xz[i] * yz[i];
            }
            return Math.round(sum * 100 / len) / 100;
        };
        this.sample = sample;
    }
}
export class Regression {
    constructor(sample) {
        this.get_line = (x_key, y_key) => {
            // y = m*x+c
            const x_mean = this.sample.get_mean(x_key);
            const y_mean = this.sample.get_mean(y_key);
            const len = this.sample.people.length;
            if (len < 2)
                return { "m": 0, "c": 0 };
            // calculate m, coefficient
            let sum_dev_product = 0;
            let ss = 0;
            for (const p of this.sample.people) {
                sum_dev_product += (p.variables[x_key] - x_mean) * (p.variables[y_key] - y_mean);
                const dev = p.variables[x_key] - x_mean;
                ss += dev * dev;
            }
            const m = sum_dev_product / ss;
            // calculate c, constant
            const c = y_mean - m * x_mean;
            return { "m": Math.round(m * 100) / 100, "c": Math.round(c * 100) / 100 };
        };
        this.sample = sample;
    }
}
