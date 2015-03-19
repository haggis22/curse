"use strict";

(function(app) {

	app.factory('Creature', ['Sex', 'BodyShape', 

		function(Sex, BodyShape) {

			function Creature(creature) {
                
                this.name = creature.name;
                this.species = creature.species == null ? 'human' : creature.species;
                this.bodyShape = creature.bodyShape == null ? BodyShape.prototype.HUMANOID : creature.bodyShape;
                this.sex = creature.sex == null ? Sex.prototype.MALE : creature.sex;
                this.str = creature.str == null ? 0 : creature.str;
                this.int = creature.int == null ? 0 : creature.int;
                this.dex = creature.dex == null ? 0 : creature.dex;
                this.health = creature.health == null ? 0 : creature.health;
                this.isUndead = creature.isUndead == null ? false : creature.isUndead;
                this.maxHealth = this.health;
				this.pack = [];
                this.isLooted = false;

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

                removeItem: function(item)
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

                    this.pack = remainingItems;
                    return item;
                },

				checkArmour: function(part)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if ((item.isArmour()) && (item.protects == part) && (item.isEquipped))
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
						if ((item.isWeapon()) && (item.isEquipped))
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
						item.isEquipped = true;
                    }
                    else if (item.isWeapon())
                    {
						this.unequip(item.type);
						item.isEquipped = true;
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
							item.isEquipped = false;
						}
				
					}  // end for
					
				},

				unequip: function(type)
				{
					for (var a=0; a < this.pack.length; a++)
					{
						var item = this.pack[a];
						if (item.type == type)
						{
							item.isEquipped = false;
						}
				
					}  // end for
					
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
                }


			};  // prototype

            Creature.prototype.constructor = Creature;

			return (Creature);

		}

	]);
	
}) (angular.module('CurseApp'));
	