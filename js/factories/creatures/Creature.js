"use strict";

(function(app) {

	app.factory('Creature', ['Sex', 'BodyShape', 'Skill', 'AttackType', 'diceService', 

		function(Sex, BodyShape, Skill, AttackType, diceService) {

			function Creature(creature) {
                
                this.name = creature.name;
                this.species = creature.species == null ? 'human' : creature.species;
                this.bodyShape = creature.bodyShape == null ? BodyShape.prototype.HUMANOID : creature.bodyShape;
                this.sex = creature.sex == null ? Sex.prototype.MALE : creature.sex;
                this.str = creature.str == null ? 0 : creature.str;
                this.int = creature.int == null ? 0 : creature.int;
                this.dex = creature.dex == null ? 0 : creature.dex;

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

                this.poisons = [];
                this.isStoned = false;
                this.isParalyzed = false;

                this.attributes = creature.attributes == null ? [] : creature.attributes;

                this.spells = [];

			};
			
			Creature.prototype = {
				
                getName: function(useDefiniteArticle)
                {
                    return this.name;
                },

                getNominative: function()
                {
                    return Sex.prototype.getNominative(this.sex);
                },

                getObjective : function()
                {
                    return Sex.prototype.getObjective(this.sex);
                },

                getPossessive: function()
                {
                    return Sex.prototype.getPossessive(this.sex);
                },

                isAlive : function()
                {
                    return this.health > 0;
                },

                isActive: function()
                {
                    return this.isAlive() && (!(this.isStoned || this.isParalyzed));
                },

                hasAnything: function()
                {
                    return this.pack.length > 0;
                },

                clearPack: function()
                {
                    this.pack.length = 0;
                },

                hasAttribute: function(attr)
                {
                    for (var a=0; a < this.attributes.length; a++)
                    {
                        if (this.attributes[a].toLowerCase() == attr.toLowerCase())
                        {
                            return true;
                        }
                    }

                    return false;
                },

                getItems: function()
                {
                    return this.pack;
                },

                getEncumbrance: function()
                {
                    var weight = 0;

                    for (var i=0; i < this.pack.length; i++)
                    {
                        weight += this.pack[i].getWeight();
                    }

                    return weight;
                },

                getWeightAllowance: function()
                {
                    return this.str * 5;
                },

				addItem: function(item)
				{
                    if (item.getWeight() + this.getEncumbrance() > this.getWeightAllowance()) 
                    {
                        return { success: false, message: this.getName(true) + ' cannot carry that much.' };
                    }

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
                            return { success: true, message: null };
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
                        return { success: false, message: this.getName() + ' does not have ' + item.getName(true) };
                    }

                    // make sure it's not equipped any more
                    item.equipped = false;

                    this.pack = remainingItems;
                    return { success: true, item: item };
                },

				checkArmour: function(part)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if ((item.isArmour) && (item.protects == part) && (item.equipped))
						{
							return item;
						}
					}
					
					return null;
				},

                checkShield: function()
                {
                    for (var a=0; a < this.pack.length; a++)
                    {
                        var item = this.pack[a];
                        if ((item.isShield) && (item.equipped))
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
						if ((item.isWeapon) && (item.equipped))
						{
							return item;
						}
					}
					
					return null;
				},

				useItem: function(item)
				{
                    if (typeof item.use === 'function')
                    {
                        item.use(this);
                    }
					
				},

				unequipAllOfType: function(type)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if (item.type == type)
						{
							item.equipped = false;
						}
				
					}  // end for
					
				},

                unequipItem: function(item)
                {
                    for (var i=0; i < this.pack.length; i++)
                    {
                        if (this.pack[i] == item)
                        {
                            this.pack[i].equipped = false;
                        }
                    }
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

                getSkill: function(skillName)
                {
                    if (this.skills.hasOwnProperty(skillName))
                    {
                        return this.skills[skillName];
                    }

                    return null;
                },

                getSkillLevel: function(skillName)
                {
                    var skill = this.getSkill(skillName);
                    if (skill == null)
                    {
                        return 0;
                    }

                    return skill.level;
                },

                adjustSkill: function(skillName, amount)
                {
                    var skill = this.getSkill(skillName);
                    if (skill == null)
                    {
                        skill = new Skill(skillName, 0);
                        this.skills[skillName] = skill;
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
                },

                getProtection: function(attack)
                {
                    var response = 
                    {
                        blocked: 0,
                        descriptions: []
                    }

                    // TODO: Shield spell

                    if (attack.damage > 0)
                    {

                        if (attack.isPhysicalAttack)
                        {
                            var shield = this.checkShield();
                            if (shield != null)
                            {
                                var melee = this.getSkillLevel("melee");
                                if (diceService.rollDie(1, 100) <= melee)
                                {
                                    var shieldBlock = Math.min(attack.damage, shield.getProtection());

                                    if (shieldBlock > 0)
                                    {
                                        response.blocked += shieldBlock;
                                        response.descriptions.push(this.getPossessive() + ' ' + shield.name + ' absorbed ' + shieldBlock + ' of the damage');
                                    }
                                }
                            }


                            if (attack.damage > response.blocked)
                            {
                                // there is still some damage to try to absorb
                                var armour = this.checkArmour(attack.bodyPart.name);

					            if (armour != null)
					            {
                                    // TODO: limited blocked to the remaining amount of damage
                                    var armourBlock = Math.min((attack.damage - response.blocked), armour.getProtection());

                                    if (armourBlock > 0)
                                    {
                                        response.blocked += armourBlock;
                                        response.descriptions.push(this.getPossessive() + ' ' + armour.name + ' absorbed ' + armourBlock + ' of the damage');
                                    }

                                }
                            }

                        }  // end if attack caused any damage

                        response.blocked = Math.min(attack.damage, response.blocked);

                    }

                    return response;

                } , // getProtection

                isPoisoned: function()
                {
                    return this.poisons.length > 0;
                },

                addPoison: function(venom, date)
                {
                    venom.lastTime = new Date(date);
                    this.poisons.push(venom);
                },

                curePoison: function()
                {
                    // remove all poisons
                    this.poisons.length = 0;
                },

                checkHealth: function()
                {
                    if (this.health < 0)
                    {
                        // Negative health would just look weird
                        this.health = 0;
                    }

                },

                checkTime: function(date)
                {
                    // check for any poisons
                    for (var p=0; p < this.poisons.length; p++)
                    {
                        var poison = this.poisons[p];

                        var effectTime = poison.lastTime.getTime() + (poison.interval * 1000);

                        if (date.getTime() >= effectTime)
                        {
                            this.health -= diceService.rollDie(poison.damage.min, poison.damage.max);
                            this.checkHealth();

                            poison.lastTime = new Date(date);
                        }


                    }

                }


			};  // prototype

			return (Creature);

		}

	]);
	
}) (angular.module('CurseApp'));
	