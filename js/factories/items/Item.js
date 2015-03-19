"use strict";

(function (app) {

    app.factory('Item', ['BodyShape',

		function (BodyShape) {

            function Item(type, name, article, damage, use, amount, frequency, protects) {

                this.type = type;
                this.name = name;
                this.article = article;
                this.damage = damage;
                this.use = use;
                this.amount = amount;
                this.frequency = frequency;
                this.protects = protects;
                this.isEquipped = false;
	
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
                        case Item.prototype.ARMOUR:
                        case Item.prototype.SHIELD:
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

                }

		    };  // prototype

		    return (Item);

		}

	]);

})(angular.module('CurseApp'));
