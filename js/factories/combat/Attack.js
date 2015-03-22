"use strict";

(function (app) {

    app.factory('Attack', 

		function () {

		    function Attack(attack) 
            {
                this.type = attack.type == null ? Attack.prototype.WEAPON : attack.type;
                this.damage = attack.damage;
                this.weapon = attack.weapon == null ? 'fist' : attack.weapon;
		    };

		    Attack.prototype = {

                WEAPON: 1,
                BITE: 2,
                CLAW: 3,

                getDescription: function(attacker, target, bodyPart, damage)
                {
                    switch (this.type)
	                {
		                case this.WEAPON:
                            return attacker.getName(true) + ' hit ' + target.getName(true) + ' in the ' + bodyPart.name + ' with ' + attacker.getPossessive() + ' ' + this.weapon  + ' for ' + damage + ' damage!';
		
		                case this.BITE: 
		                case this.CLAW: 
                            return attacker.getName(true) + ' ' + this.weapon + ' ' + target.getName(true) + ' in the ' + bodyPart.name + ' for ' + damage + ' damage!';
		
	                } 
	
                    return 'ATTACK ERROR';
                }

		    };  // prototype

		    return (Attack);

		}

	);

})(angular.module('CurseApp'));
	

