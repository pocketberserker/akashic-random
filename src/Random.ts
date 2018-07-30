export class Random {

  private random: g.RandomGenerator;

  constructor(random: g.RandomGenerator) {
    this.random = random;
  }

  /**
   * [min, max)
   */
  getInt(min: number, max: number): number {
    return this.random.get(min, max - 1);
  }

  /**
   * [0, 1)
   */
  get(): number {
    return this.getInt(0, Number.MAX_VALUE) / Number.MAX_VALUE;
  }

  getBool(): boolean {
    return !!this.random.get(0, 1);
  }
}