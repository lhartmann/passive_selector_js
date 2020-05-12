// License GNU Affero-GPL
// (c) 2020, Lucas V. Hartmann

// Keeps only the best push.
// "best" is judged via the objective function.
// Lower is better.

module.exports = function(objective) {
	this._objective = objective;
	this._error = Infinity;
	this._data = {};
	
	// Push a new candidate
	this.push = data => {
		// Evaluate quality
		let error = this._objective(data);
		
		// null or false can be used to mark unacceptable solutions.
		if (error === null || error === false) return;
		
		// Keep if better.
		if (error < this._error) {
			this._error = error;
			this._data = JSON.stringify(data);
		}
	}
	
	// Return the best pushed solution.
	this.get = () => {
		return JSON.parse(this._data);
	}
};
