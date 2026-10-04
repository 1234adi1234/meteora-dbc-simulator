# Meteora Dynamic Bonding Curve (DBC) Simulator & Preset Engine

**Crypto World's Fair — Best use of Meteora's Dynamic Bonding Curve (DBC)**  
**Track Prize Pool:** 20,000 USDC  
**Author:** Aditya (@1234adi1234)  
**Target Payout Wallet (Solana):** `4N9HQfVSu7zjWLBD7WbaFroj79sDh4Sx76hRon7Vh86n`  

---

## 🚀 Overview
Meteora's Dynamic Bonding Curve (DBC) introduces unprecedented configurability for token launchpads on Solana: customizable curve geometries, dynamic fee tiers, graduation liquidity thresholds, and automated migration into Meteora DAMM v2 constant product pools.

This project delivers:
1. **Mathematical Simulation Engine:** Exact integral calculus for reserve accumulation, slippage prediction, and spot price progression across Linear, Exponential, and Long-Tail Meme curve geometries.
2. **DAMM v2 Pool Migration Modeling:** Simulates liquidity migration, LP token locking, creator fee accrual, and price dislocation across the graduation boundary.
3. **SDK Config Generator:** Exports schema-compliant JSON configuration manifests directly consumable by `@meteora-ag/dynamic-bonding-curve-sdk`.

---

## 🧪 Mathematical Formulations

### 1. Linear Bonding Curve
$$P(S) = P_0 + m \cdot S$$
$$R(S) = \int_0^S (P_0 + m \cdot s)\, ds = P_0 \cdot S + \frac{1}{2} m S^2$$

### 2. Exponential Bonding Curve
$$P(S) = P_0 \cdot e^{k \cdot S}$$
$$R(S) = \int_0^S P_0 \cdot e^{k \cdot s}\, ds = \frac{P_0}{k} (e^{k \cdot S} - 1)$$

---

## 🛠️ Verification & Test Suite
Run test suite:
```bash
node --test tests/meteora.test.mjs
```
Output:
```
✔ LinearBondingCurve computes accurate spot and reserve integration
✔ ExponentialBondingCurve calculates monotonic price increase
✔ DAMMMigrator simulates migration and exports valid SDK config
ℹ pass 3, fail 0
```

---

## 💻 CLI Usage
Simulate default meme launch curve with DAMM v2 migration:
```bash
node src/cli.mjs meme-standard
```

Simulate exponential curve launch:
```bash
node src/cli.mjs exponential
```

---

## 📜 Judging Access
Open source under MIT. Read permissions available for Meteora reviewer `dannxbt`.
