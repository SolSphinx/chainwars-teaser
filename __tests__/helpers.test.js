// ================================================
// FILE: __tests__/helpers.test.js  (Node 18+ built-in test runner)
// Run locally with:  node --test
// ================================================
import test from "node:test";
import assert from "node:assert";
import { nextMilestoneProgress, sumMarketcapBySide, MILESTONES, isPlaceholderMint } from "../lib/helpers.js";

test("nextMilestoneProgress: 0% at 0 total", () => { assert.strictEqual(nextMilestoneProgress(0), 0); });

test("nextMilestoneProgress: 50% at half of first milestone", () => { const half = Math.floor(MILESTONES[0].target / 2); assert.strictEqual(nextMilestoneProgress(half), 50); });

test("nextMilestoneProgress: caps at 100% beyond last milestone", () => { const beyond = MILESTONES[MILESTONES.length - 1].target * 2; assert.strictEqual(nextMilestoneProgress(beyond), 100); });

test("sumMarketcapBySide: sums only matching side", () => { const tokens = [ { side: "good", marketCapUSD: 100 }, { side: "good", marketCapUSD: 50 }, { side: "dark", marketCapUSD: 10 }, { side: "dark", marketCapUSD: 5 }, ]; assert.strictEqual(sumMarketcapBySide(tokens, "good"), 150); assert.strictEqual(sumMarketcapBySide(tokens, "dark"), 15); });

test("isPlaceholderMint: detects placeholders and empty", () => { assert.strictEqual(isPlaceholderMint(undefined), true); assert.strictEqual(isPlaceholderMint(null), true); assert.strictEqual(isPlaceholderMint(""), true); assert.strictEqual(isPlaceholderMint("SOLAK_MINT_PLACEHOLDER"), true); assert.strictEqual(isPlaceholderMint("So11111111111111111111111111111111111111112"), false); });
