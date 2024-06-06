	DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
		var pow, def, damage;

		if (this.isHpMinimum(active, passive, weapon, isCritical, trueHitValue)) {
			return -1;
		}

		pow = this.calculateAttackPower(active, passive, weapon, isCritical, activeTotalStatus, trueHitValue);
		def = this.calculateDefense(active, passive, weapon, isCritical, passiveTotalStatus, trueHitValue);
		
		if (this.isCritical(active, passive, weapon, isCritical, trueHitValue)) {
			pow = Math.floor(pow * this.getCriticalFactor());
		}

		damage = pow - def;
		if (this.isHalveAttack(active, passive, weapon, isCritical, trueHitValue)) {
			if (!this.isHalveAttackBreak(active, passive, weapon, isCritical, trueHitValue)) {
				damage = Math.floor(damage / 2);
			}
		}

		return this.validValue(active, passive, weapon, damage);
	}

	var PCC_MODE = 0;
	// 0: uses custom.roundcrt
	// 1: uses Wlv
	// -1: disabled

	// roundcount critical multiplier script by 1-239
	AttackEvaluator.HitCritical.calculateCritical = function(virtualActive, virtualPassive, attackEntry) {
		var percent = CriticalCalculator.calculateCritical(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, virtualActive.totalStatus, virtualPassive.totalStatus);
		
		var activecount = Calculator.calculateRoundCount(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon);

		if(activecount == 2) {
			if(virtualActive.roundCount == 0) {
				if (PCC_MODE === 0) {
					if(typeof virtualActive.unitSelf.custom.roundcrt == 'number') {
						percent *= virtualActive.unitSelf.custom.roundcrt;
					}
				// support for using Wlv as PCC
				} else if (PCC_MODE === 1) {
					percent *= RealBonus.getWlv(virtualActive.unitSelf);
				}
			}
		}
		root.log("Critical: " + percent + "%");
		return Probability.getProbability(percent);

	}
