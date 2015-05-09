"use strict";

(function (app) {

    app.factory('Attack', ['Action', 'SkillType', 'AttackType', 'diceService',

		function (Action, SkillType, AttackType, diceService) {

		    function Attack(attack) 
            {
                // Create an action based on the actor
                Action.call(this, attack);

                this.target = attack.target;
                this.type = attack.type;

                // add the skills required for the given AttackType
                var attackTypeSkills = this.type.getSkills();
                for (var s=0; s < attackTypeSkills.length; s++)
                {
                    this.addRelevantSkill(attackTypeSkills[s]);
                }

                this.isPhysical = true;

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
                return this.actor.isActive() && this.target.isAlive();
            };

            Attack.prototype.calculateSpeed = function() {

                var msg = "Attack Speed, attacker: " + this.actor.getName(null) + ", dex: " + this.actor.dex;

                var speedChance = this.actor.dex;
                    
                var relevantSkills = this.getRelevantSkills();
                for (var s=0; s < relevantSkills.length; s++)
                {
                    msg += ", " + relevantSkills[s] + ": " + this.actor.getSkillLevel(relevantSkills[s]);
                    speedChance += this.actor.getSkillLevel(relevantSkills[s]);
                }

                this.speed = diceService.averageDie(0, speedChance);
                msg += ", TOTAL: " + speedChance + ", Roll: " + this.speed;
                console.info(msg);

            };

            // returns an array of text descriptions of the attack and its effects
            Attack.prototype.perform = function(date)
            {
                var actions = [];

                if (!this.isStillRequired())
                {
                    return actions;
                }

                var relevant = this.getRelevantSkills();

                var msg = this.actor.getName(null) + ' Attack, Target: ' + this.target.getName(null) + ', Base: 50, myDex ' + this.actor.dex + ', tgtDex: -' + this.target.dex + ',';

                var toHit = 50 + this.actor.dex - this.target.dex;
                
                for (var r=0; r < relevant.length; r++)
                {
                    msg += ' my' + relevant[r] + ': ' + this.actor.getSkillLevel(relevant[r]);
                    msg += ' tgt' + relevant[r] + ': -' + this.target.getSkillLevel(relevant[r]);

                    toHit += this.actor.getSkillLevel(relevant[r]);
                    toHit -= this.target.getSkillLevel(relevant[r]);
                }

                var roll = diceService.rollDie(1, 100);

				msg += ' toHit: ' + toHit + ', roll: ' + roll;

                console.log(msg);
				
                if (roll <= toHit)
				{
                    var damageRange = this.type.getDamage();

                    this.damage = diceService.rollDie(damageRange.min, damageRange.max);

                    var damageModifier = 1;

                    console.log('Damage calc for ' + this.actor.getName(null));

                    for (var r=0; r < relevant.length; r++)
                    {
                        damageModifier += (this.actor.getSkillLevel(relevant[r]) / 100);
                        damageModifier -= (this.target.getSkillLevel(relevant[r]) / 100);

                        console.log('  Skill: ' + relevant[r] + ', Add ' + this.actor.getSkillLevel(relevant[r]) / 100);
                        console.log('  Skill: ' + relevant[r] + ', Sub ' + this.target.getSkillLevel(relevant[r]) / 100);

                    }

                    console.log('BaseDamage: ' + this.damage + ', modifier: ' + damageModifier + ', damage: ' + (this.damage * damageModifier));
                    this.damage *= damageModifier;

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

					actions = actions.concat(this.type.checkEffects(this, date));

                    this.target.health -= this.damage;
                    this.target.checkHealth();

					if (!this.target.isAlive())
					{
						actions.push(this.actor.getName(true) + (this.target.hasAttribute('undead') ? ' destroyed ' : ' killed ') + this.target.getName(true) + '!');
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
	

