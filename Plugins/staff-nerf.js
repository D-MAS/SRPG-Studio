// staves use Mag/2 instead of entire magic stat
// Not compatible with Str/Mag merge
	Calculator.calculateRecoveryItemPlus = function(unit, targetUnit, item) {
		var plus = 0;
		var itemType = item.getItemType();
		
		if (itemType !== ItemType.RECOVERY && itemType !== ItemType.ENTIRERECOVERY) {
			return 0;
		}
		
		// If the item is a wand, add the user's Mag.
		if (item.isWand()) {
			plus = ParamBonus.getMag(unit) / 2;
		}
		
		return plus;
	}
	
	Calculator.calculateDamageItemPlus = function(unit, targetUnit, item) {
		var damageInfo, damageType;
		var plus = 0;
		var itemType = item.getItemType();
		
		if (itemType === ItemType.DAMAGE) {
			damageInfo = item.getDamageInfo();
		}
		else {
			return 0;
		}
		
		damageType = damageInfo.getDamageType();
		if (item.isWand()) {
			if (damageType === DamageType.MAGIC) {
				plus = ParamBonus.getMag(unit) / 2;
			}
		}
		
		return plus;
	}
	
