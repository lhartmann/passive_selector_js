#! /usr/bin/env node
// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Select resistors for OPAMP-less voltage divider.
// Circuit Configuration
//                 ,---/\/\---Voff
// Vin       Rin   |    Rh
// ---------/\/\---*----------Vout
//                 |    Rl
//                  `---/\/\---GND

const PN = require('./lib/preferred_numbers.js');
const Best = require('./lib/best.js');
const Permutate = require('./lib/permutate.js');
const parallel = require('./lib/parallel.js');

const Rset = PN.grow(1e3, 1e6, PN.E24);

// Circuit model
let Vil = 0.0;
let Vih = 5.0;
let Vol = 2.2;
let Voh = 2.8;
let Vcc = 5.0;

function Vo(R) {
	let Rh  = R[0];
	let Rl  = R[1];
	let Rin = R[2];
	
	let Rth = parallel([Rh, Rl]);
	let Vth = Vcc * Rl / (Rh + Rl);
	
	// Superposition
	return {
		Vol: (Vil * Rth + Vth * Rin) / (Rin+Rth),
		Voh: (Vih * Rth + Vth * Rin) / (Rin+Rth),
	};
}

function objective(R) {
	// Evaluate
	let V = Vo(R);
	
	// Discard unacceptable
	if (V.Vol < Vol) return false;
	if (V.Voh > Voh) return false;
	
	// Calculate error
	return Voh - V.Voh + V.Vol - Vol;
}

let best = new Best(objective);
Permutate(3, Rset, R => best.push(R));
let R = best.get();

console.log("Best resistors: ", R);
console.log("Best Vo: ", Vo(R));
