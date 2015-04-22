"use strict";

(function (app) {

    app.factory('Attack', ['Action', 'SkillType', 'AttackType', 'diceService',

		function (Action, SkillType, AttackType, diceService) {

		    function Attack(attack) 
            {
                // Create an action based on the actor
                Action.call(this, attack);

                this.isPhysicalAttack = true;

                this.target = attack.target;
                this.type = attack.type;

                this.addRelevantSkill(SkillType.prototype.ID_MELEE);
                this.calculateSpeed();

                this.damage = 0;
                this.bodyPart = null;

		    };

			Attack.prototype = Object.create(Action.prototype);

            Attack.prototype.getIntentDescription = function()
            {
                return this.actor.getName(true) + ' will attack ' + this.target.getName(true);
            };

            Attack.prototype.isStillRequired = function()
            {
                return this.actor.isAlive() && this.target.isAlive();
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

				// TODO: include skills for weapon, if relevant

                var roll = diceService.rollDie(1, 100);
                console.log('actor: ' + this.actor.getName(null) + ', target: ' + this.target.getName(null) + ', toHit: ' + toHit + ', roll: ' + roll);
				
                if (roll <= toHit)
				{
                    var damageRange = this.type.getDamage();

                    this.damage = diceService.rollDie(damageRange.min, damageRange.max);

                    this.bodyPart = diceService.randomElement(this.target.bodyShape.parts);

                    // TODO: Should any armour protection happen BEFORE the damageFactor is calculated?
                    this.damage = Math.round(this.damage * this.bodyPart.damageFactor);

                    // the attack type knows best how to describe the attack in text form
                    actions.push(this.type.getDescription(this));

                    var protection = this.target.getProtection(this);

                    this.damage = Math.max(this.damage - protection.blocked, 0);
                    
                    // add any description of protection there might have been
                    for (var p=0; p < protection.descriptions.length; p++)
                    {
                        actions.push(protection.descriptions[p]);
                    }

					this.target.health -= this.damage;

                    if (this.target.health < 0)
                    {
                        // Negative health would just look weird
                        this.target.health = 0;
                    }

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
	

