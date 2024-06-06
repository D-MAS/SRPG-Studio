/*  D_RNG_EQUALIZE
set to false to disable outright
*/
var D_RNG_EQUALIZE = true;
/*  D_RNG_MODE
Makes it so that the balance can be unlucky
	 1 - Benevolent	Only benefits player Hit/Avo
	 0 - Fair		Affects both players and enemies
	-1 - Unfair		Only benefits enemy Hit/Avo
	NEW SETTINGS
	 2 - Angel		Always gives the player maximum benefit
	-2 - Death		Always gives the enemy maximum benefit
*/
var D_RNG_MODE = 0;
/*  D_RNG_FORMULA
	0 - use old formula
this either doubles the chance of hitting or missing, whichever has less magnitude. Subtle.
	1 - use updated formula
has a bit of a 2rn effect, being able to make high hits much more accurate and low hits much more inaccurate
a 90 hit can have either 81 or 99 effective hit
*/
var D_RNG_FORMULA = 1;
/*  TWO_RN_ENABLED
whether or not to use the 2rn system famous for the GBA games, less powerful due to scaling
*/
var D_RNG_IGNORE_PLAYER_CRT = true

var TWO_RN_ENABLED = TWO_RN_ENABLED || false;
// var TWO_RN_ENABLED = false;
// if (TWO_RN_ENABLED == undefined) {
	// TWO_RN_ENABLED = false;
// }

(function() {
	/*  anna
	the "luck" owed to the player, updated whenever a hit is calculated
	*/
	var anna = 0;
	
	var HitMult = 1;
	var CritMult = 3;
	var DmgMult = 3;
	
	BandRNG = {
		ClampAnna: function() {
			anna = Math.max(Math.min(anna, (D_RNG_MODE + 1) * 100, 100), (D_RNG_MODE - 1) * 100, -100);
			root.log('ANNA: ' + anna);
		},
	
		UpdateHit: function(playerActive, hit, dmg) {
			if (hit === undefined) {
				hit = 100;
			}
			var amt = (hit - 100) * HitMult;
			amt *= dmg * DmgMult / 100;
			anna += playerActive ? Math.round(amt) : -Math.round(amt);
			this.ClampAnna();
		},
	
		UpdateCritical: function(playerActive, crt, dmg) {
			if (crt === undefined) {
				crt = 100;
			}
			var amt = (crt - 100) * CritMult;
			amt *= dmg * DmgMult / 100;
			anna += playerActive ? Math.round(amt) : -Math.round(amt);
			this.ClampAnna();
		},
	
		UpdateMiss: function(playerActive, hit, dmg) {
			if (hit === undefined) {
				hit = 0;
			}
			var amt = hit * HitMult;
			amt *= dmg * DmgMult / 100;
			anna += playerActive ? Math.round(amt) : -Math.round(amt);
			this.ClampAnna();
		}
	}

    var alias1 = AttackEvaluator.HitCritical.calculateHit
    AttackEvaluator.HitCritical.calculateHit = function(virtualActive, virtualPassive, attackEntry) {
        if (!D_RNG_EQUALIZE) {
            return alias1.call(this, virtualActive, virtualPassive, attackEntry);
        }

		// if (anna == undefined) {
			// anna = 0;
			// root.log('ANNA UNDEFINED');
		// }
		var percent = HitCalculator.calculateHit(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, virtualActive.totalStatus, virtualPassive.totalStatus);
		if (percent <= 0 || percent >= 100) {
            return alias1.call(this, virtualActive, virtualPassive, attackEntry);
		}
		var mod = percent;
		
		var playerActive = virtualActive.unitSelf.getUnitType()==UnitType.PLAYER;
		var playerPassive = virtualPassive.unitSelf.getUnitType()==UnitType.PLAYER;
		// mod hit rate
		if (anna != 0) {
			if (D_RNG_FORMULA > 0) {
				if (playerActive) {
					mod = percent + ((percent * (100 - percent) / 100) * (anna / 100));
				}
				if (playerPassive) {
					mod = percent - ((percent * (100 - percent) / 100) * (anna / 100));
				}
			} else {
				if (playerActive) {
					mod = percent + ((anna > 0 ? Math.min(percent, (100 - percent) / 2) : Math.min(percent / 2, (100 - percent) * 2)) * (anna / 100));
				}
				if (playerPassive) {
					mod = percent - ((anna < 0 ? Math.min(percent, (100 - percent) / 2) : Math.min(percent / 2, (100 - percent) * 2)) * (anna / 100));
				}
				// mod = Math.floor(((mod * anna) + (percent * (100 - anna))) / 100);
			}
			mod = Math.round(mod)
		}
		var isHit = Probability.getProbability(mod);
        if (TWO_RN_ENABLED) {
			var n = Probability.getRandomNumber() % 100;
			var m = Probability.getRandomNumber() % 100;
			var trueHit = Math.floor((n+m)/2);
			
			isHit = trueHit < mod
		}
		// mod anna var
		// if (virtualActive.unitSelf.getUnitType()==UnitType.PLAYER) {
			// anna += Math.round((isHit ? (percent - 100) : percent) / 4);
		// }
		// if (virtualPassive.unitSelf.getUnitType()==UnitType.PLAYER) {
			// anna += Math.round((isHit ? (100 - percent) : -percent) / 4);
		// }
		// anna = Math.max(Math.min(anna, D_RNG_MODE < 0 ? 0 : 100), D_RNG_MODE > 0 ? 0 : -100);
		// anna = Math.max(Math.min(anna, (D_RNG_MODE + 1) * 100, 100), (D_RNG_MODE - 1) * 100, -100);
		// root.log('HIT: ' + percent + ' / MOD: ' + mod + ' / ANNA: ' + anna);
		this._hit = percent;
		
		return isHit;
    }

    var alias2 = AttackEvaluator.HitCritical.calculateCritical;
	AttackEvaluator.HitCritical.calculateCritical = function(virtualActive, virtualPassive, attackEntry) {
        if (!D_RNG_EQUALIZE) {
			return alias2.call(this, virtualActive, virtualPassive, attackEntry);
		}
		var percent = CriticalCalculator.calculateCritical(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, virtualActive.totalStatus, virtualPassive.totalStatus);
		
		this._crt = percent;
		
		return Probability.getProbability(percent);
		// return percent >= 1;
	}
	
    // var alias3 = AttackEvaluator.HitCritical.calculateDamage;
	// AttackEvaluator.HitCritical.calculateDamage = function(virtualActive, virtualPassive, attackEntry) {
        // if (!D_RNG_EQUALIZE) {
			// return alias3.call(this, virtualActive, virtualPassive, attackEntry);
		// }
		
		// var trueHitValue = 0;
		
		// if (this._skill !== null) {
			// trueHitValue = this._skill.getSkillValue();
		// }
		
		// if (DamageCalculator.isHpMinimum(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, attackEntry.isCritical, trueHitValue)) {
			// // The opponent HP will be 1 if the attack hits in a way of turning the value of current HP-1 into damage. 
			// return virtualPassive.hp - 1;
		// }
		
		// if (DamageCalculator.isFinish(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, attackEntry.isCritical, trueHitValue)) {
			// return virtualPassive.hp;
		// }
		
		// return DamageCalculator.calculateDamage(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, attackEntry.isCritical, virtualActive.totalStatus, virtualPassive.totalStatus, trueHitValue);
	// }
	
    var alias4 = AttackEvaluator.HitCritical.evaluateAttackEntry;
	AttackEvaluator.HitCritical.evaluateAttackEntry = function(virtualActive, virtualPassive, attackEntry) {
		alias4.call(this, virtualActive, virtualPassive, attackEntry);
		
		root.log("Hit: " + this._hit + " / Crt: " + this._crt + " / HP: " + virtualPassive.hp);

		var playerActive = virtualActive.unitSelf.getUnitType()==UnitType.PLAYER;
		var playerPassive = virtualPassive.unitSelf.getUnitType()==UnitType.PLAYER;

		var dmg = DamageCalculator.calculateDamage(virtualActive.unitSelf, virtualPassive.unitSelf, virtualActive.weapon, false, virtualActive.totalStatus, virtualPassive.totalStatus, 0)
		if (attackEntry.isHit) {
			if (attackEntry.isCritical && virtualPassive.hp > dmg) {
				if (playerActive && !D_RNG_IGNORE_PLAYER_CRT) {
					BandRNG.UpdateCritical(true, this._crt, attackEntry.damagePassive);
				}
				if (playerPassive) {
					BandRNG.UpdateCritical(false, this._crt, attackEntry.damagePassive);
				}
			}
			if (playerActive) {
				BandRNG.UpdateHit(true, this._hit, attackEntry.damagePassive);
			}
			if (playerPassive) {
				BandRNG.UpdateHit(false, this._hit, attackEntry.damagePassive);
			}
		} else {
			if (playerActive) {
				BandRNG.UpdateMiss(true, this._hit, dmg);
			}
			if (playerPassive) {
				BandRNG.UpdateMiss(false, this._hit, dmg);
			}
		}
	}
})()