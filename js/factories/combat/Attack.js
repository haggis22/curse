"use strict";

(function (app) {

    app.factory('Attack', ['Action', 'SkillType', 'AttackType', 'diceService',

		function (Action, SkillType, AttackType, diceService) {

		    function Attack(attack) 
            {
                // start a player with a blank name and all defaults
                Action.call(this, attack);

                this.type = attack.type == null ? Attack.prototype.WEAPON : attack.type;

                if (typeof attack.damage === 'number')
                {
                    this.damage = { min: attack.damage, max: attack.damage };
                }
                else
                {
                    this.damage = attack.damage;
                }

                this.weapon = attack.weapon == null ? 'fist' : attack.weapon;

                this.addRelevantSkill(SkillType.prototype.ID_MELEE);
                this.calculateSpeed();

		    };

			Attack.prototype = Object.create(Action.prototype);

            Attack.prototype.constructor = Attack;

            Attack.prototype.getTarget = function()
            {
                return this.target;
            }

            Attack.prototype.getType = function()
            {
                return this.type;
            };

            Attack.prototype.getIntentDescription = function()
            {
                return this.getActor().getName(true) + ' will attack ' + this.getTarget().getName(true);
            };

            Attack.prototype.isStillRequired = function()
            {
                return this.getActor().isAlive() && this.getTarget().isAlive();
            };

            Attack.prototype.calculateSpeed = function() {

                var msg = "Attack Speed, attacker: " + this.actor.getName(null) + ", dex: " + this.actor.dex;

                var speedChance = this.actor.dex;
                    
                var relevantSkills = this.getRelevantSkills();
                for (var s=0; s < relevantSkills.length; s++)
                {
                    var skillType = SkillType.prototype.getSkillType(relevantSkills[s]);
                    msg += ", " + skillType.getName() + ": " + this.actor.getSkillLevel(relevantSkills[s]);
                    speedChance += this.actor.getSkillLevel(relevantSkills[s]);
                }

                this.speed = diceService.averageDie(0, speedChance);
                msg += ", TOTAL: " + speedChance + ", Roll: " + this.speed;
                console.info(msg);

            };

            Attack.prototype.perform = function()
            {
                var actions = [];

                if (!this.isStillRequired())
                {
                    return actions;
                }

                var relevant = this.getRelevantSkills();

                var toHit = 50 + this.actor.dex - this.target.dex;
                
                for (var r=0; r < relevant.length; r++)
                {
                    toHit += this.actor.getSkillLevel(relevant[r]);
                    toHit -= this.target.getSkillLevel(relevant[r]);
                }

				var roll = diceService.rollDie(1, 100);
                console.log('actor: ' + this.actor.getName(null) + ', target: ' + this.target.getName(null) + ', toHit: ' + toHit + ', roll: ' + roll);
				if (roll <= toHit)
				{
                    var damage = diceService.rollDie(this.damage.min, this.damage.max);

                    var bodyPart = diceService.randomElement(this.target.bodyShape.parts);

                    damage = Math.round(damage * bodyPart.damageFactor);

                    var description = '';

                    switch (this.getType())
	                {
		                case AttackType.prototype.WEAPON:
                            description = this.actor.getName(true) + ' hit ' + this.target.getName(true) + ' in the ' + bodyPart.name + ' with ';
                            if (this.weapon.article != '')
                            {
                                description += this.actor.getPossessive() + ' ';
                            }
                            description += this.weapon.getName()  + ' for ' + damage + ' damage!';
                            actions.push(description);
                            break;
		
		                case AttackType.prototype.BITE: 
		                case AttackType.prototype.CLAW: 
                            actions.push(this.actor.getName(true) + ' ' + this.weapon.getName() + ' ' + this.target.getName(true) + ' in the ' + bodyPart.name + ' for ' + damage + ' damage!');
                            break;
		
	                } 
					
                    var protection = this.getTarget().getProtection(this.getType(), damage, bodyPart);
                    damage = Math.max(damage - protection.damage, 0);
                    
                    // add any description of protection there might have been
                    for (var p=0; p < protection.descriptions.length; p++)
                    {
                        actions.push(protection.descriptions[p]);
                    }

					// Math.max will ensure the health can't go below zero. Negative health would just look weird
					this.target.health = Math.max(0, this.target.health - damage);
					
					if (!this.target.isAlive())
					{
						actions.push(this.actor.getName(true) + (this.target.isUndead ? ' destroyed ' : ' killed ') + this.target.getName(true) + '!');
					}
					
				}
				else
				{
					actions.push(this.actor.getName(true) + ' attacked ' + this.target.getName(true) + ' but missed...');
				}

                return actions;

            };

		    return (Attack);

		}

	]);

})(angular.module('CurseApp'));
	

