(function () {
	var alias1 = DamageCalculator.calculateDefense;
	DamageCalculator.calculateDefense = function (active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		var def = alias1.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
		var skill = SkillControl.getPossessionCustomSkill(active, 'Pierce');
		
		if (skill) {
			// root.log(def);
			def = Math.floor(def/2);
			// root.log(def);
		}
		
		return def;
	}
}) ();
