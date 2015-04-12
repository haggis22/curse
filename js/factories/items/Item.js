"use strict";

(function (app) {

    app.factory('Item', ['BodyShape',

		function (BodyShape) {

            function Item(item) {

                this.type = item.type;
                this.name = item.name;
                this.article = item.article == null ? 'a' : item.article;
                this.damage = item.damage;
                this.use = item.use;
                this.amount = item.amount == null ? 1 : item.amount;
                this.frequency = item.frequency == null ? 1 : item.frequency;
                this.protects = item.protects;
                this.setEquipped(false);
	
            };

		    Item.prototype = {

		        GOLD: 0,
                WEAPON: 1,
                POTION: 2,
                ARMOUR: 3,
                SHIELD: 4,
                NECK: 5,
                WEALTH: 6,

                USE_HEAL: 1,

                getName: function(useDefiniteArticle)
                {
                    var text = '';

                    if (this.isGold())
                    {
                        text = this.amount + ' gold piece' + (this.amount > 1 ? 's' : '');
                    }
                    else
                    {
                        if (useDefiniteArticle != null)
                        {
                            text += (useDefiniteArticle ? 'the' : this.article) + ' ';
                        }
                
                        text += this.name;
                    }

                    return text;
                },

                isGold: function()
                {
                    return this.type == this.GOLD;
                },

                isWeapon: function()
                {
                    return this.type == this.WEAPON;
                },

                isArmour : function()
                {
                    return this.type == this.ARMOUR;
                },

                isPotion : function()
                {
                    return this.type == this.POTION;
                },

                isEquippableBy: function(creature)
                {
                    switch (this.type)
                    {
                        case Item.prototype.GOLD:
                        case Item.prototype.WEALTH:
                            return false;

                        case Item.prototype.WEAPON:
                            return creature.isShape([BodyShape.prototype.HUMANOID, BodyShape.prototype.WINGED_HUMANOID]) && creature.useWeapons;

                        case Item.prototype.ARMOUR:
                        case Item.prototype.SHIELD:
                            return creature.isShape([BodyShape.prototype.HUMANOID, BodyShape.prototype.WINGED_HUMANOID]) && creature.useArmour;

                        case Item.prototype.NECK:
                            return creature.isShape([BodyShape.prototype.HUMANOID, BodyShape.prototype.WINGED_HUMANOID]);

                        case Item.prototype.POTION:
                            return false;

                        default:
                            return false;
                    }

                },

                quaff: function(quaffer)
                {
                    if (!this.isPotion())
                    {
                        console.error(quaffer.getName(true) + " tried to drink non-drinkable " + this.name);
                        return;
                    }

                    if (this.amount == 0)
                    {
                        console.error(quaffer.getName(true) + " tried to drink, but the " + this.name + " is empty.");
                        return;
                    }

                    switch (this.use)
					{
						case Item.prototype.USE_HEAL:
                            var cure = quaffer.heal(this.damage);
							// gameService.actions.push('The potion cured you of ' + cure + ' damage');
							break;
							
					}  // end switch

                    this.amount--;
                    if (this.amount == 0)
                    {
                        this.name = "empty flask";
                        this.article = "an";
                        this.use = null
                    }

                },

                isEquipped: function()
                {
                    return this.equipped;
                },

                setEquipped: function(isEquipped)
                {
                    this.equipped = isEquipped;
                }

		    };  // prototype

		    return (Item);

		}

	]);

})(angular.module('CurseApp'));
