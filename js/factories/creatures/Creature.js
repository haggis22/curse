"use strict";

(function(app) {

	app.factory('Creature', ['Sex', 'BodyShape', 

		function(Sex, BodyShape) {

			function Creature(name, species, bodyShape, sex, str, int, dex, health) {
                
                this.name = name;
                this.species = species == null ? 'human' : species;
                this.bodyShape = bodyShape == null ? BodyShape.prototype.HUMANOID : bodyShape;
                this.sex = sex == null ? Sex.prototype.MALE : sex;
                this.str = str == null ? 0 : str;
                this.int = int == null ? 0 : int;
                this.dex = dex == null ? 0 : dex;
                this.health = health == null ? 0 : health;
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
	