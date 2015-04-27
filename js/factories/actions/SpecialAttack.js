"use strict";

(function(app) {

	app.factory('SpecialAttack', ['Action', 

		function(Action) {

			function SpecialAttack(attack) {

                Action.call(this, attack);

                this.target = attack.target;
                this.type = attack.type;

                // the attack type will define whether this is a physical attack. If not specified, then "false"
                this.isPhysical = attack.type.isPhysical || false;

                this.calculateSpeed();

			};

			SpecialAttack.prototype = Object.create(Action.prototype);

            SpecialAttack.prototype.getIntentDescription = function()
            {
                return this.actor.getName(true) + ' will use ' + this.type.name + ' on ' + this.target.getName(true);
            };

            SpecialAttack.prototype.calculateSpeed = function() {

                // TODO: base the speed on the attack itself
                return 50;
/*
                var msg = "Spell Speed, attacker: " + this.actor.getName(null); + ", castingTime: " + this.spellType.castingTime;

                var speedChance = this.spellType.castingTime;
                    
                var relevantSkills = this.getRelevantSkills();
                for (var s=0; s < relevantSkills.length; s++)
                {
                    msg += ", " + relevantSkills[s] + ": " + this.actor.getSkillLevel(relevantSkills[s]);
                    speedChance += this.actor.getSkillLevel(relevantSkills[s]) / 2;
                }

                this.speed = diceService.averageDie(0, speedChance);
                msg += ", TOTAL: " + speedChance + ", Roll: " + this.speed;
                console.info(msg);
*/
            };

            SpecialAttack.prototype.perform = function()
            {
                if (!this.actor.isActive())
                {   
                    // the would-be attacker is incapacitated/dead, nothing to do here
                    return;
                }

                return this.type.perform(this);

            };

			return (SpecialAttack);

		}

	]);
	
}) (angular.module('CurseApp'));
	