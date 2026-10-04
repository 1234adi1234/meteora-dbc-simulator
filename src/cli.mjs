#!/usr/bin/env node
import { LinearBondingCurve, ExponentialBondingCurve, LongTailMemeCurve } from './curves.mjs';
import { DAMMMigrator } from './damm_migrator.mjs';

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║  Meteora Dynamic Bonding Curve (DBC) Simulator & Config Generator   ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');

const args = process.argv.slice(2);
const preset = args[0] || 'meme-standard';

let curve;
let gradSupply = 800_000_000;

if (preset === 'meme-standard') {
  curve = new LongTailMemeCurve(0.00000001, 85); // 85 SOL graduation target
} else if (preset === 'exponential') {
  curve = new ExponentialBondingCurve(0.00000002, 0.000000003);
  gradSupply = 600_000_000;
} else {
  curve = new LinearBondingCurve(0.00000001, 0.00000000000015);
}

const sim = DAMMMigrator.simulateGraduation({
  curve,
  graduationSupply: gradSupply,
  quoteToken: 'SOL'
});

console.log(`\n📈 Preset Configuration: [${preset.toUpperCase()}]`);
console.log(`   - Graduation Supply: ${gradSupply.toLocaleString()} tokens`);
console.log(`   - Total SOL Injected on Curve: ${sim.totalQuoteCollected} SOL`);
console.log(`   - Creator Fee Accrued: ${sim.creatorFeeAmount} SOL`);
console.log(`   - Net SOL Migrating to DAMM v2: ${sim.netQuoteForLiquidity} SOL`);
console.log(`   - Reserved Pool Liquidity: ${sim.tokensForLiquidity.toLocaleString()} tokens`);
console.log(`   - Ending Curve Spot: ${sim.endingCurveSpotPrice.toExponential(4)} SOL`);
console.log(`   - Initial DAMM v2 Pool Price: ${sim.initialDammV2PoolPrice.toExponential(4)} SOL`);
console.log(`   - Price Dislocation: ${sim.priceDislocationPercent}% (${sim.isSmoothMigration ? '✅ SMOOTH MIGRATION' : '⚠️ HIGH SLIPPAGE'})`);

const sdkConfig = DAMMMigrator.exportSDKConfig({
  curveType: preset,
  graduationSupply: gradSupply
});

console.log('\n📄 Exported SDK Manifest (@meteora-ag/dynamic-bonding-curve-sdk compatible):');
console.log(JSON.stringify(sdkConfig, null, 2));
