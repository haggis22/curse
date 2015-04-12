"use strict";

(function(app) {

	app.factory('Spell', ['SpellType', 'SkillType', 'Action', 'diceService',

		function(SpellType, SkillType, Action, diceService) {

			function Spell(spell) {

                Action.call(this, spell);

                this.spellType = spell.spellType;

                this.addRelevantSkill(SkillType.prototype.ID_MAGIC);
                this.calculateSpeed();

			};

			Spell.prototype = Object.create(Action.prototype);

            Spell.prototype.constructor = Spell;

            Spell.prototype.getIntentDescription = function()
            {
                var msg = this.getActor().getName(true) + ' will cast ' + this.spellType.getIncantation();
                if (this.getTarget() != null) {
                    msg += ' on ' + this.getTarget().getName(true);
                }
                return msg;
            };

            Spell.prototype.calculateSpeed = function() {

                var msg = "Spell Speed, attacker: " + this.actor.getName(null); + ", castingTime: " + this.spellType.castingTime;

                var speedChance = this.spellType.castingTime;
                    
                var relevantSkills = this.getRelevantSkills();
                for (var s=0; s < relevantSkills.length; s++)
                {
                    var skillType = SkillType.prototype.getSkillType(relevantSkills[s]);
                    msg += ", " + skillType.getName() + ": " + this.actor.getSkillLevel(relevantSkills[s]);
                    speedChance += this.actor.getSkillLevel(relevantSkills[s]) / 2;
                }

                this.speed = diceService.averageDie(0, speedChance);
                msg += ", TOTAL: " + speedChance + ", Roll: " + this.speed;
                console.info(msg);

            };

            Spell.prototype.perform = function()
            {
                if (!this.getActor().isAlive())
                {   
                    // the would-b spellcaster is dead. Nothing to do here.
                    return;
                }

                // reduce the spellcaster's power by the spell's amount - if they don't have enough then the spell fizzles...
                this.actor.power = this.actor.power - this.spellType.power;

                if (this.actor.power < 0)
                {
                    // not enough power left to cast the spell - reset their power to 0
                    this.actor.power = 0;
                    var description = this.actor.getName(true) + ' tried to cast ' + this.spellType.getIncantation + ', but the spell fizzled...';

                    return [ description ];
                }

                switch (this.spellType.getType())
                {
                    case SpellType.prototype.TYPE_ATTACK:
                        return this.performAttack();

                }  // switch statement

            };


            Spell.prototype.performAttack = function()
            {

                var actions = [];

                var relevant = this.getRelevantSkills();

                var damage = Math.round(this.actor.getSkillLevel(SkillType.prototype.ID_MAGIC) * diceService.rollDecimalDie(this.spellType.damage.min, this.spellType.damage.max));

                // TODO: target magic resistance?

                var description = this.actor.getName(true) + ' cast ' + this.spellType.getIncantation() + ' on ' + this.target.getName(true) + ' for ' + damage + ' damage!';

                actions.push(description);
			
				// Math.max will ensure the health can't go below zero. Negative health would just look weird
				this.target.health = Math.max(0, this.target.health - damage);
					
				if (!this.target.isAlive())
				{
					actions.push(this.actor.getName(true) + (this.target.isUndead ? ' destroyed ' : ' killed ') + this.target.getName(true) + '!');
				}
					
                return actions;

            };

			return (Spell);

		}

	]);
	
}) (angular.module('CurseApp'));
	