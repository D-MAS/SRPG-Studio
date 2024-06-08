(function() {
	var alias1 = DamageCalculator.calculateAttackPower;
	DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
		var pow = alias1.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);
		var skill = SkillControl.getPossessionCustomSkill(active, 'Bonecrusher');
		
		if (skill) {
			root.log(pow);
			pow += Math.max(weapon.getWeight() - RealBonus.getBld(passive), 0);
		}
		
		return pow;
	}
}) ();
