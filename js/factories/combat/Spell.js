"use strict";

(function(app) {

	app.factory('Spell', ['SpellType', 'SkillType', 'Action', 'diceService', 'AttackType',

		function(SpellType, SkillType, Action, diceService, AttackType) {

			function Spell(spell) {

                Action.call(this, spell);

                this.spellType = spell.spellType;

                this.addRelevantSkill(SkillType.prototype.ID_MAGIC);
                this.calculateSpeed();

			};

			Spell.prototype = Object.create(Action.prototype);

            Spell.prototype.getIntentDescription = function()
            {
                var msg = this.getActor().getName(true) + ' will cast ' + this.spellType.getIncantation();
                if (this.getTarget() != null) {
                    msg += ' on ' + this.getTarget().getName(true);
                }
                return msg;
            };

            Spell.prototype.calculateSpeed = function() {

                var msg = "Spell Speed, attacker: " + this.getActor().getName(null); + ", castingTime: " + this.spellType.castingTime;

                var speedChance = this.spellType.castingTime;
                    
                var relevantSkills = this.getRelevantSkills();
                for (var s=0; s < relevantSkills.length; s++)
                {
                    var skillType = SkillType.prototype.getSkillType(relevantSkills[s]);
                    msg += ", " + skillType.getName() + ": " + this.getActor().getSkillLevel(relevantSkills[s]);
                    speedChance += this.getActor().getSkillLevel(relevantSkills[s]) / 2;
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
                this.getActor().power = this.getActor().power - this.spellType.power;

                if (this.getActor().power < 0)
                {
                    // not enough power left to cast the spell - reset their power to 0
                    this.getActor().power = 0;
                    var description = this.getActor().getName(true) + ' tried to cast ' + this.spellType.getIncantation + ', but the spell fizzled...';

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

                var damage = Math.round(this.getActor().getSkillLevel(SkillType.prototype.ID_MAGIC) * diceService.rollDecimalDie(this.spellType.damage.min, this.spellType.damage.max));

                var description = this.getActor().getName(true) + ' cast ' + this.spellType.getIncantation() + ' on ' + this.getTarget().getName(true) + ' for ' + damage + ' damage!';

                actions.push(description);

                // Determine what resistance to magic the target might have
                // Note: magic attacks do not focus on a body part
                var protection = this.getTarget().getProtection(AttackType.prototype.MAGIC, damage, null);
                damage = Math.max(damage - protection.damage, 0);
                    
                // add any description of protection there might have been
                for (var p=0; p < protection.descriptions.length; p++)
                {
                    actions.push(protection.descriptions[p]);
                }

				// Math.max will ensure the health can't go below zero. Negative health would just look weird
				this.getTarget().health = Math.max(0, this.getTarget().health - damage);
					
				if (!this.getTarget().isAlive())
				{
					actions.push(this.getActor().getName(true) + (this.getTarget().isUndead ? ' destroyed ' : ' killed ') + this.getTarget().getName(true) + '!');
				}
					
                return actions;

            };

			return (Spell);

		}

	]);
	
}) (angular.module('CurseApp'));
	