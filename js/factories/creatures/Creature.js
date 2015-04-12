"use strict";

(function(app) {

	app.factory('Creature', ['Sex', 'BodyShape', 'Skill',

		function(Sex, BodyShape, Skill) {

			function Creature(creature) {
                
                this.name = creature.name;
                this.species = creature.species == null ? 'human' : creature.species;
                this.bodyShape = creature.bodyShape == null ? BodyShape.prototype.HUMANOID : creature.bodyShape;
                this.sex = creature.sex == null ? Sex.prototype.MALE : creature.sex;
                this.str = creature.str == null ? 0 : creature.str;
                this.int = creature.int == null ? 0 : creature.int;
                this.dex = creature.dex == null ? 0 : creature.dex;

                this.isUndead = creature.isUndead == null ? false : creature.isUndead;

                this.health = creature.health == null ? 0 : creature.health;
                this.maxHealth = this.health;

                this.power = creature.power == null ? 0 : creature.power;
                this.maxPower = this.power;

                this.skills = creature.skills == null ? {} : creature.skills;
                this.attacks = creature.attacks;

				this.pack = [];
                this.isLooted = false;

                this.useWeapons = creature.useWeapons == null ? true : creature.useWeapons;
                this.useArmour = creature.useArmour == null ? true : creature.useArmour;

                this.spells = [];

			};
			
			Creature.prototype = {
				
                getName: function(useDefiniteArticle)
                {
                    return this.name;
                },

                getPossessive: function()
                {
                    return Sex.prototype.getPossessive(this.sex);
                },

                isAlive : function()
                {
                    return this.health > 0;
                },

                hasAnything: function()
                {
                    return this.pack.length > 0;
                },

				addItem: function(item)
				{
					switch (item.type)
					{
/*
                        TODO: Consolidate gold into a single item
						case Item.prototype.GOLD:
							this.gold += item.amount;
							break;
*/			
						default:
							this.pack.push(item); 
							break; 
					}
					
				},

                dropItem: function(item)
                {
                    var remainingItems = [];

                    for (var i=0; i < this.pack.length; i++)
                    {
                        if (this.pack[i] != item)
                        {
                            remainingItems.push(this.pack[i]);
                        }
                    }

                    if (remainingItems.length == this.pack.length)
                    {
                        console.error(this.getName() + ' does not have ' + item.getName(true));
                        return null;
                    }

                    // make sure it's not equipped any more
                    item.setEquipped(false);

                    this.pack = remainingItems;
                    return item;
                },

				checkArmour: function(part)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if ((item.isArmour()) && (item.protects == part) && (item.isEquipped()))
						{
							return item;
						}
					}
					
					return null;
				},

				checkWeapon: function()
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if ((item.isWeapon()) && (item.isEquipped()))
						{
							return item;
						}
					}
					
					return null;
				},

				useItem: function(item)
				{
					if (item.isArmour())
                    {
						this.removeArmour(item.protects);
						item.setEquipped(true);
                    }
                    else if (item.isWeapon())
                    {
						this.unequipAllOfType(item.type);
						item.setEquipped(true);
                    }
                    else if (item.isPotion())
                    {
						this.quaff(item);
                    }
					
				},

				removeArmour: function(protects)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if ((item.isArmour()) && (item.protects == protects))
						{
							item.setEquipped(false);
						}
				
					}  // end for
					
				},

				unequipAllOfType: function(type)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if (item.type == type)
						{
							item.setEquipped(false);
						}
				
					}  // end for
					
				},

                unequipItem: function(item)
                {
                    for (var i=0; i < this.pack.length; i++)
                    {
                        if (this.pack[i] == item)
                        {
                            this.pack[i].setEquipped(false);
                        }
                    }
                },

				quaff: function(potion)
				{
					potion.quaff(this);
				},

                countGold: function()
                {
                    var gold = 0;
                    
                    for (var i=0; i < this.pack.length; i++)
                    {
                        if (this.pack[i].isGold())
                        {
                            gold += this.pack[i].amount;
                        }
                    }

                    return gold;
                },

                isShape: function(shapeArray)
                {
                    for (var s=0; s < shapeArray.length; s++)
                    {
                        if (this.bodyShape == shapeArray[s])
                        {
                            return true;
                        }
                    }

                    return false;
                },

                heal: function(cure)
                {
                    cure = Math.min(cure, this.maxHealth - this.health);
					this.health += cure;
                    return cure;
                },

                clearSkills: function()
                {
                    for (var skill in this.skills)
                    {
                        if (this.skills.hasOwnProperty(skill))
                        {
                            delete this.skills[skill];
                        }
                    }
                },

                hasSkills: function()
                {
                    for (var skill in this.skills)
                    {
                        if (this.skills.hasOwnProperty(skill))
                        {
                            return true;
                        }
                    }

                    return false;
                },

                getSkill: function(skillType)
                {
                    if (this.skills.hasOwnProperty(skillType))
                    {
                        return this.skills[skillType];
                    }

                    return null;
                },

                getSkillLevel: function(skillType)
                {
                    var skill = this.getSkill(skillType);
                    if (skill == null)
                    {
                        return 0;
                    }

                    return skill.getLevel();
                },

                adjustSkill: function(skillType, amount)
                {
                    var skill = this.getSkill(skillType);
                    if (skill == null)
                    {
                        skill = new Skill(skillType, 0);
                        this.skills[skillType] = skill;
                    }

                    skill.level += amount;
                },

                hasSpecialAttacks: function()
                {
                    return ((this.attacks != null) && (this.attacks.length > 0));
                },

                getKnownSpells: function() {
                    return this.spells;
                },

                knowsSpells: function() {
                    return this.spells.length > 0;
                },

                addKnownSpell: function(spellName) {
                    for (var s=0; s < this.spells.length; s++)
                    {
                        if (this.spells[s] == spellName)
                        {
                            // already know the spell, nothing to do
                            return;
                        }
                    }

                    this.spells.push(spellName);
                },

                clearSpells: function() {
                    this.spells.length = 0;
                }

			};  // prototype

            Creature.prototype.constructor = Creature;

			return (Creature);

		}

	]);
	
}) (angular.module('CurseApp'));
	