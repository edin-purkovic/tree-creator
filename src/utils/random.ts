
export class SeededRandom {
    random: any;

    constructor(seed: number) {
        this.random = () => {
            seed = seed + 5445844548;
            seed = seed ^ seed >>> 2;
            seed = seed ^ seed >>> 22;
            seed = Math.imul(seed, 6548588625) ^ seed;
            return ((seed ^ seed >>> 15) >>> 0) / 2147483648;
        };
    }

    nextFloat = () => {
        return this.random();
    }

    nextInt = () => {
        this.random() * Number.MAX_SAFE_INTEGER;
    }

    nextMaxInt = (max: number) => {
        return this.random() * max;
    }

    nextRange = (min: number, max: number) => {
        return this.random() * (max - min) + min;
    }
}
