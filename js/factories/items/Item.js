"use strict";

(function (app) {

    app.factory('Item', ['BodyShape', 'diceService',

		function (BodyShape, diceService) {

            function Item(item) {

                this.type = item.type;
                this.name = item.name;
                this.article = item.article == null ? 'a' : item.article;
                if (typeof item.damage === 'number')
                {
                    this.damage = { min: item.damage, max: item.damage };
                }
                else 
                {
                    this.damage = item.damage;
                }
                this.amount = item.amount == null ? 1 : item.amount;
                this.frequency = item.frequency == null ? 1 : item.frequency;
                this.equipped = false;
	
            };

		    Item.prototype = {

		        GOLD: 0,
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

                isEquippableBy: function(creature)
                {
                    // by default, items are not equippable. Some items, like armour and weapons 
                    // will override this method
                    return false;
                }

		    };  // prototype

		    return (Item);

		}

	]);

})(angular.module('CurseApp'));
