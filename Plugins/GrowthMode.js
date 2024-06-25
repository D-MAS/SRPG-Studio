// var D_FIXED_ZERO = false;
// var D_FIXED_MODE = true;

ExperienceControl._createGrowthArray = function(unit) {
	var i, n;
	var count = ParamGroup.getParameterCount();
	var growthArray = [];
	var weapon = ItemControl.getEquippedWeapon(unit);
	if (this._unitGrowths === undefined) {
		this._unitGrowths = [,];
	}
	
	var globalParameter = root.getMetaSession().global;
	// var rerollCount = 2; // Number of rerolls allowed if all stats are zero
	var rerollCount = globalParameter.rerollCount || 0;
	
	for (i = 0; i < count; i++) {
		if (globalParameter.zeroGrowth) {
			growthArray[i] = 0;
		} else if (globalParameter.fixedGrowth) {
			// Calculate the growth value (or the growth rate).
			n = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
			
			// Set the rise value.
			if (this._unitGrowths[unit, i] === undefined) {
				this._unitGrowths[unit, i] = (((unit.getLv() - 2) * ParamGroup.getGrowthBonus(unit, i)) + 50) % 100;
			}
			this._unitGrowths[unit, i] += n;
			var j = this._unitGrowths[unit, i];
			if (n != 0) {
				// root.log('unit: ' + unit + ' / stat: ' + i + ' / growth: ' + j);
			}
			if (j > 0) {
				j = Math.floor(j / 100);
				this._unitGrowths[unit, i] -= j * 100;
			} else {
				j = 0;
			}
			growthArray[i] = j;
		} else {
			// Calculate the growth value (or the growth rate).
			n = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
			
			// Set the rise value.
			growthArray[i] = this._getGrowthValue(n);
			// root.log(growthArray[i]);
		}
	}
	
	// Check if all growth values are zero and reroll if necessary
	if (this._areAllValuesZero(growthArray) && rerollCount > 0) {
		for (var reroll = 0; reroll < rerollCount; reroll++) {
			root.log("Reroll count: " + reroll + "/" + rerollCount);
			for (i = 0; i < count; i++) {
				if (!globalParameter.zeroGrowth && !globalParameter.fixedGrowth) {
					n = ParamGroup.getGrowthBonus(unit, i) + ParamGroup.getUnitTotalGrowthBonus(unit, i, weapon);
					growthArray[i] = this._getGrowthValue(n);
				}
			}
			if (!this._areAllValuesZero(growthArray)) {
				break; // Exit the loop if at least one value is non-zero
			}
		}
	}
	
	return growthArray;
}

ExperienceControl._areAllValuesZero = function(array) {
	for (var i = 0; i < array.length; i++) {
		// root.log("Growth " + i + ":" + array[i]);
		if (array[i] !== 0) {
			return false;
		}
	}
	return true;
}

// ExperienceControl._getGrowthValue = function(n) {
	// return Math.random() < n / 100 ? 1 : 0;
// }
