// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Generate permutations, repetition allowed.
// Repeatedly call fcn() with n elements from set.
module.exports = function(n, set, fcn) {
	let N = set.length;
	for (let index = 0; index < Math.pow(N, n); index++) {
		let values = [];
		for (let i=0; i<n; i++)
			values.push(set[Math.floor(index/Math.pow(N,i))%N]);
		
		fcn(values);
	}
};

// Example:
// permutate(3, [ 0,1,2,3,4 ], console.log);
