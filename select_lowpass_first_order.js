#! /usr/bin/env node
// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Select resistor-capacitor values for 1st order lowpass filters.

const PN = require('./lib/preferred_numbers.js');
const Best = require('./lib/best.js');

// Available components:
//    All resistors with E12 prefixes, from 100 to 910k.
var Rset = PN.grow(100, 910000, PN.E12);
//    All capacitors with E6 prefixes, from 1nF to 1uF.
var Cset = PN.grow(1e-9, 1e-6, PN.E6);

// Desired frequencies: All starting with 1,2 or 5, from 1kHz to 100kHz.
// In other words, 1k 2k 5k 10k 20k 50k 100k.
var Fset = PN.grow(1e3, 1e5, [1,2,5]);

// Cutoff frequency from components
function Fc(R,C) {
	return 1 / (2 * Math.PI * R * C);
};

// Iterate over target frequencies, each is a separate filter
Fset.forEach((F) => {
	let best = new Best(x => Math.abs(F - Fc(x.R,x.C)));
	
	// Iterate over resitors and capacitors
	Rset.forEach(R => {
		Cset.forEach(C => {
			best.push({R: R, C: C});
		});
	});
	best = best.get();
	
	// Pretty print
	function N(v) { return PN.nice(v,2); }
	console.log(`F=${N(F)}  R=${N(best.R)}  C=${N(best.C)}  =>  ${N(Fc(best.R, best.C))}`);
});
