// Absorption skill now only absorbs 25% of HP, with weapons absorbing half. stacks additively.
(function() {
	AttackEvaluator.ActiveAction._arrangeActiveDamage = function(virtualActive, virtualPassive, attackEntry) {
		var max;
		var active = virtualActive.unitSelf;
		var damageActive = attackEntry.damageActive;
		var damagePassive = attackEntry.damagePassive;
		
		var absorptionRate = this._getAbsorptionRate(virtualActive, virtualPassive, attackEntry)
		if (absorptionRate > 0) {
			max = ParamBonus.getMhp(active);
			
			damageActive = Math.floor(Math.max(absorptionRate * damagePassive, 1));
			
			if (virtualActive.hp + damageActive > max) {
				damageActive = max - virtualActive.hp;
			}
			
			if (virtualActive.hp + damageActive < 1) {
				damageActive = damageActive + 1;
			}
			
			// If damage is minus, it means recovery.
			damageActive *= -1;
		}
		else {
			damageActive = 0;
		}
		
		return damageActive;
	}
	AttackEvaluator.ActiveAction._getAbsorptionRate = function(virtualActive, virtualPassive, attackEntry) {
		var absorptionRate = 0;
		var active = virtualActive.unitSelf;
		var passive = virtualPassive.unitSelf;
		var weapon = virtualActive.weapon;
		
		if (weapon !== null && weapon.getWeaponOption() === WeaponOption.HPABSORB) {
			if (weapon.custom.absorption == null) {
				absorptionRate += 0.5
			} else {
				absorptionRate += weapon.custom.absorption;
			}
		}
		
		if (SkillControl.checkAndPushSkill(active, passive, attackEntry, true, SkillType.DAMAGEABSORPTION) !== null) {
			absorptionRate += 0.2;
		}
		
		return absorptionRate;
	}

})()
