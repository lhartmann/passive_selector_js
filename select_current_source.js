#! /usr/bin/env node
// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Select resistors for LM317-based current source.
// Uses parallel resistors to overcome shortage of different values.

const PN = require('./lib/preferred_numbers.js');
const Best = require('./lib/best.js');
const Permutate = require('./lib/permutate.js');
const parallel = require('./lib/parallel.js');

// Few prefixes from 1k to 1M.
const Rset = PN.grow(10, 1000, PN.E6);

// Desired current, and circuit model
let Iout_desired = 0.34;
function Iout(R) {
	// All resistors in parallel
	return 1.25 / parallel(R);
}

// Objective function, returns badness, "error" of a solution.
// Better solutions should return lower values.
// Return false for invalid, unnaceptable, solutions.
function objective(R) {
	return Math.abs(Iout_desired - Iout(R));
}

let best = new Best(objective);
for (let n=1; n<5; n++) Permutate(n, Rset, R => best.push(R));
let R = best.get();

console.log("Best resistors: ", R);
console.log("Best Iout: ", Iout(R));
