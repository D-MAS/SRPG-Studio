(function() {
	var alias1 = HitCalculator.validValue
	HitCalculator.validValue = function(active, passive, weapon, percent) {
		if (CompatibleCalculator.getPower(active, passive, weapon) > 0) {
			return 100;
		}
		return alias1.call(this, active, passive, weapon, percent);
	}
	DefineControl.getMinHitPercent = function() {
		return 1;
	}
	DefineControl.getMaxHitPercent = function() {
		return 99;
	}
})()