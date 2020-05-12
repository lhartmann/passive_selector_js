#! /usr/bin/env node
// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Select resistors for voltage regultator.
// Uses parallel resistors to overcome shortage of different values.

const PN = require('./lib/preferred_numbers.js');
const Best = require('./lib/best.js');
const permutate = require('./lib/permutate.js');
const parallel = require('./lib/parallel.js');

// Very few prefixes (10 22 47) from 1k to 1M.
const Rset = PN.grow(1e3, 1e6, PN.E3);

// Circuit description:
// R[0] and R[1] are paralleled on the low-side.
// R[2] and R[3] are paralleled on the high-side.
let Vout_desired = 12.3;
function Vout(R) {
	var Vref = 1.25;
	var Rlo = parallel([R[0], R[1]]);
	var Rhi = parallel([R[2], R[3]]);
	return Vref / Rlo * (Rhi + Rlo);
}

// Objective function, returns badness, "error" of a solution.
// Better solutions should return lower values.
// Return false for invalid, unnaceptable, solutions.
function objective(R) {
	return Math.abs(Vout_desired - Vout(R));
}

let best = new Best(objective);
permutate(4, Rset, R => best.push(R));
let R = best.get();

console.log("Best resistors: ", R);
console.log("Best Vout: ", Vout(R));
