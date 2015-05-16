"use strict";

(function (app) {

    app.factory('AmmoWeapon', ['Weapon', 'BodyShape', 'diceService',

		function (Weapon, BodyShape, diceService) {

            function AmmoWeapon(weapon) {

                Weapon.call(this, weapon);

                this.ammo = weapon.ammo;

            };

            AmmoWeapon.prototype = Object.create(Weapon.prototype);

            AmmoWeapon.prototype.isReady = function(attack) 
            {
                var pack = attack.actor.getItems();

                for (var i=0; i < pack.length; i++)
                {
                    var item = pack[i];
                    for (var a=0; a < item.attributes.length; a++)
                    {
                        if (item.attributes[a] == this.ammo)
                        {
                            // we have at least one of the ammo required
                            return { success: true };
                        }
                    }
                }

                return { success: false, message: attack.actor.getName(true) + ' cannot use ' + attack.actor.getPossessive() + ' ' + this.name + ' without ' + this.ammo };

            };


    	    return (AmmoWeapon);

		}

	]);

})(angular.module('CurseApp'));
