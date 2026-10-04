/**
 * Meteora Dynamic Bonding Curve Mathematical Models
 * Implements spot price and definite integral reserve calculations
 */

export class LinearBondingCurve {
  constructor(initialPrice, slope) {
    this.initialPrice = initialPrice; // P0
    this.slope = slope;               // m: price delta per token sold
  }

  getSpotPrice(supply) {
    return this.initialPrice + this.slope * supply;
  }

  /**
   * Reserve integral: R(S) = Integral from 0 to S of (P0 + m*s) ds = P0*S + 0.5*m*S^2
   */
  calculateReserveRequired(targetSupply) {
    return this.initialPrice * targetSupply + 0.5 * this.slope * Math.pow(targetSupply, 2);
  }
}

export class ExponentialBondingCurve {
  constructor(initialPrice, growthRate) {
    this.initialPrice = initialPrice; // P0
    this.growthRate = growthRate;     // k: growth factor
  }

  getSpotPrice(supply) {
    return this.initialPrice * Math.exp(this.growthRate * supply);
  }

  /**
   * Reserve integral: R(S) = (P0 / k) * (e^(k*S) - 1)
   */
  calculateReserveRequired(targetSupply) {
    return (this.initialPrice / this.growthRate) * (Math.exp(this.growthRate * targetSupply) - 1);
  }
}

export class LongTailMemeCurve {
  /**
   * Steep initial price discovery flattening into steady liquidity
   */
  constructor(basePrice, targetReserve) {
    this.basePrice = basePrice;
    this.targetReserve = targetReserve;
  }

  calculateReserveRequired(targetSupply, totalSupply = 1_000_000_000) {
    const fraction = targetSupply / totalSupply;
    return this.targetReserve * Math.pow(fraction, 1.8);
  }

  getSpotPrice(supply, totalSupply = 1_000_000_000) {
    const fraction = supply / totalSupply;
    return (1.8 * this.targetReserve / totalSupply) * Math.pow(fraction, 0.8) + this.basePrice;
  }
}
