"use strict";

(function (app) {

    app.factory('AttackType', ['SkillType',

		function (SkillType) {

		    function AttackType(attackType) 
            {
                this.type = attackType.type == null ? AttackType.prototype.WEAPON : attackType.type;
                if (typeof attackType.damage === 'number')
                {
                    this.damage = { min: attackType.damage, max: attackType.damage };
                }
                else
                {
                    this.damage = attackType.damage;
                }
                this.weaponName = attackType.weaponName == null ? 'fist' : attackType.weaponName;

		    };

		    AttackType.prototype = 
            {
                WEAPON: 1,
                BITE: 2,
                CLAW: 3,
                MAGIC: 4,
                PSIONIC: 5,

                isPhysical: function(attackType)
                {
                    switch (attackType)
                    {   
                        case AttackType.prototype.WEAPON:
                        case AttackType.prototype.BITE:
                        case AttackType.prototype.CLAW:
                            return true;
                    }

                    return false;
                }
                
            };

		    return (AttackType);

		}

	]);

})(angular.module('CurseApp'));
	

