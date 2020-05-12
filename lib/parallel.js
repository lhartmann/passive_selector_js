// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Returns the equivalent resistance for a set of paralleled resistors.
// Req = parallel([R1, R2, R3, ...]);
module.exports = function(R) {
	return 1 / R.reduce((t,r) => { return t+1/r; }, 0);
};
