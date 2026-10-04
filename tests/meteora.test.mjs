import test from 'node:test';
import assert from 'node:assert/strict';
import { LinearBondingCurve, ExponentialBondingCurve, LongTailMemeCurve } from '../src/curves.mjs';
import { DAMMMigrator } from '../src/damm_migrator.mjs';

test('LinearBondingCurve computes accurate spot and reserve integration', () => {
  const curve = new LinearBondingCurve(0.001, 0.00001);
  const spotAtZero = curve.getSpotPrice(0);
  assert.equal(spotAtZero, 0.001);

  const spotAt100 = curve.getSpotPrice(100);
  assert.equal(spotAt100, 0.001 + 0.001); // 0.002

  const reserve = curve.calculateReserveRequired(100);
  assert.ok(Math.abs(reserve - 0.15) < 1e-9, 'Reserve should match integral within float tolerance');
});

test('ExponentialBondingCurve calculates monotonic price increase', () => {
  const curve = new ExponentialBondingCurve(0.0001, 0.00005);
  const p1 = curve.getSpotPrice(1000);
  const p2 = curve.getSpotPrice(2000);
  assert.ok(p2 > p1, 'Price should monotonically increase');

  const reserve = curve.calculateReserveRequired(2000);
  assert.ok(reserve > 0);
});

test('DAMMMigrator simulates migration and exports valid SDK config', () => {
  const curve = new LongTailMemeCurve(0.00000001, 85);
  const sim = DAMMMigrator.simulateGraduation({
    curve,
    graduationSupply: 800_000_000,
    quoteToken: 'SOL'
  });

  assert.ok(sim.totalQuoteCollected > 50, 'Should collect significant quote');
  assert.ok(sim.netQuoteForLiquidity < sim.totalQuoteCollected, 'Net quote should subtract fee');
  assert.equal(typeof sim.priceDislocationPercent, 'number');

  const config = DAMMMigrator.exportSDKConfig({
    curveType: 'meme-standard',
    graduationSupply: 800_000_000
  });

  assert.equal(config.protocol, 'Meteora-DBC');
  assert.equal(config.migrationTarget, 'DAMM_V2');
  assert.equal(config.lockLiquidity, true);
});
