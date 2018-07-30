import {Random} from "./Random";

const sum = (arr: number[]) => {
  return arr.reduce((prev, current, i) => {
    if (current <= 0) {
      throw new Error(`Invalid weight ${current} at array[${i}]. Weight must be greater than 0.`);
    }
    return prev + current;
  }, 0);
};

export interface AliasTable {
  length: number;
  probabilities: number[];
  alias: number[];
}

export class AliasMethod {
  private random: Random;

  constructor(original: g.RandomGenerator) {
    this.random = new Random(original);
  }

  generate(weights: number[]): AliasTable {
    const length = weights.length;
    const total = sum(weights);

    if (total === 0) {
      throw new Error("Sum of weights must be greater than 0.");
    }

    const probabilities = weights.map(x => (x * length) / total);
  
    const small: number[] = [];
    const large: number[] = [];
    for (let i = 0; i < length; i++) {
      const p = probabilities[i];
      if (p < 1) {
        small.push(i);
      } else if (p > 1) {
        large.push(i);
      }
    }
  
    const alias = Array(length).fill(-1);
    while (small.length && large.length) {
      const j = small.pop() as number;
      const k = large[large.length - 1];
      alias[j] = k;
      probabilities[k] -= 1 - probabilities[j];
      if (probabilities[k] < 1) {
        small.push(k);
        large.pop();
      }
    }
  
    return {
      length,
      probabilities,
      alias
    };
  }

  get(table: AliasTable): number {
    const u = this.random.get();
    const n = this.random.getInt(0, table.length);
    return u <= table.probabilities[n] ? n : table.alias[n];
  }
}
