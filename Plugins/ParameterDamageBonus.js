/*
	ParameterDamageBonus.js
	When a skill has custom keyword "ParamAttack", damage will be increased by % of user param
	Ex: Skill Shot
	Custom Keyword: ParamAttack
	Custom Parameters:
	{
		ski: 50,
		wlv: 30
	}
	Increases damage by 50% of Skill and 30% of Weapon Level
*/
(function() {
	var alias1 = AbilityCalculator.getPower;
	AbilityCalculator.getPower = function(unit, weapon) {
		var i, bonus, currentSkill;
		var pow = alias1.call(this, unit, weapon);
		var skillArray = SkillControl.getDirectSkillArray(unit, SkillType.CUSTOM, "ParamAttack");
		
		bonus = 0;
		for (i = 0; i < skillArray.length && skillArray.length > 0; i++) {
			currentSkill = skillArray[i].skill;
			bonus += currentSkill.custom.str == undefined ? 0 : currentSkill.custom.str * RealBonus.getStr(unit) / 100;
			bonus += currentSkill.custom.mag == undefined ? 0 : currentSkill.custom.mag * RealBonus.getMag(unit) / 100;
			bonus += currentSkill.custom.ski == undefined ? 0 : currentSkill.custom.ski * RealBonus.getSki(unit) / 100;
			bonus += currentSkill.custom.spd == undefined ? 0 : currentSkill.custom.spd * RealBonus.getSpd(unit) / 100;
			bonus += currentSkill.custom.def == undefined ? 0 : currentSkill.custom.def * RealBonus.getDef(unit) / 100;
			bonus += currentSkill.custom.res == undefined ? 0 : currentSkill.custom.res * RealBonus.getMdf(unit) / 100;
			bonus += currentSkill.custom.luk == undefined ? 0 : currentSkill.custom.luk * RealBonus.getLuk(unit) / 100;
			bonus += currentSkill.custom.bld == undefined ? 0 : currentSkill.custom.bld * RealBonus.getBld(unit) / 100;
			bonus += currentSkill.custom.wlv == undefined ? 0 : currentSkill.custom.wlv * RealBonus.getWlv(unit) / 100;
			bonus += currentSkill.custom.mov == undefined ? 0 : currentSkill.custom.mov * RealBonus.getMov(unit) / 100;
			bonus += currentSkill.custom.mhp == undefined ? 0 : currentSkill.custom.mhp * RealBonus.getMhp(unit) / 100;
			bonus += currentSkill.custom.agi == undefined ? 0 : currentSkill.custom.agi * AbilityCalculator.getAgility(unit, weapon) / 100;
			bonus += currentSkill.custom.hp == undefined ? 0 : currentSkill.custom.hp * unit.getHp() / 100;
			bonus += currentSkill.custom.lv == undefined ? 0 : currentSkill.custom.lv * unit.getLv() / 100;
		}
		return Math.floor(pow+bonus);
	}
}) ();
