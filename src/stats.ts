// @ts-nocheck
export class Person {
    
    constructor(name) {
        this.name = name;
        this.variables = {};
    }

    set_variable = (key, value) => {
        this.variables[key] = value;
    }
}


export class Sample {

    constructor(name) {
        this.name = name;
        this.people = [];
    }

    set_person = (person) => {
        this.people.push(person);
    }

    // get_mean = (variable="") => {
    //     if (this.people.length < 1) return 0;
    //     if (variable !== "") {
    //         // get mean of particular variable
    //         let sum = 0;
    //         for (const p of this.people) {
    //             sum += p.variables[variable];
    //         }
    //         return sum/this.people.length;
    //     }
    //     // get means of all variables
    //     // assuming all people have same number of variables
    //     const means = {};
    //     for (const v of this.people[0].variables) {
    //         // get mean of particular variable
    //         let sum = 0;
    //         for (const p of this.people) {
    //             sum += p.variables[v];
    //         }
    //         means[v] = sum/this.people.length;
    //     }
    //     return means;
    // }

    get_mean = (variable) => {
        // get mean of a particular variable
        let sum = 0;
        for (const p of this.people) {
            sum += p.variables[variable];
        }
        return sum/this.people.length;
    }

    get_variance = (variable) => {
        // get variance of a particular variable
        const mean = this.get_mean(variable);
        let ss = 0;
        for (const p of this.people) {
            // calculate deviation
            const dev = p.variables[variable]-mean;
            ss += dev*dev;
        }
        return ss/this.people.length;
    }

    get_standard_deviation = (variable) => {
        // get standard deviation of a particular variable
        const variance = this.get_variance(variable);
        return Math.sqrt(variance);
    }

    get_scores = (variable) => {
        // get scores list of a particular variable
        const scores = [];
        for (const p of this.people) {
            scores.push(p.variables[variable]);
        }
        return scores;
    }

    get_z_scores = (variable) => {
        // get x scores list of raw scores of a particular variable
        const scores = this.get_scores(variable);
        const z_scores = [];
        const mean = this.get_mean(variable);
        const sdev = this.get_standard_deviation(variable);
        for (const s of scores) {
            if (sdev == 0) {
                // 0 is preferred over NaN
                z_scores.push(0);
                continue;
            }
            const z = (s-mean)/sdev;
            z_scores.push(z);
        }
        return z_scores;
    }
}


export class Correlation {

    constructor(sample) {
        this.sample = sample;
    }

    get_coefficient = (x, y) => {
        const xz = this.sample.get_z_scores(x);
        const yz = this.sample.get_z_scores(y);
        const len = xz.length;

        let sum = 0;
        for (let i = 0; i < len; ++i) {
            sum += xz[i]*yz[i];
        }

        return sum/len;
    }
}