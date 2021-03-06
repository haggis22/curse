"use strict";

(function (app) {

    app.factory('Item', ['BodyShape', 'diceService',

		function (BodyShape, diceService) {

            function Item(item) {

                this._id = item._id;
                this.type = item.type;
                this.name = item.name;
                this.article = item.article == null ? 'a' : item.article;

                this.frequency = item.frequency == null ? 1 : item.frequency;
                this.equipped = false;

                this.weight = item.weight == null ? 0 : item.weight;
                this.hands = item.hands == null ? 0 : item.hands;

                this.attributes = item.attributes == null ? [] : item.attributes;

                if (item.stackable)
                {
                    this.stackable = 
                    {
                        type: item.stackable.type,
                        plural: item.stackable.plural,
                        amount: item.stackable.amount
                    };
                }

                this.value = item.value || {};

            };

		    Item.prototype = {

                NECK: 5,

                USE_HEAL: 1,

                getName: function(useDefiniteArticle)
                {
                    var text = '';

                    if (this.stackable)
                    {
                        if (this.stackable.amount == 1)
                        {
                            return (useDefiniteArticle ? 'the' : this.article) + ' ' + this.name;
                        }

                        return (useDefiniteArticle ? 'the' : '') + ' ' + this.stackable.amount + ' ' + this.stackable.plural;
                    }


                    if (useDefiniteArticle != null)
                    {
                        return (useDefiniteArticle ? 'the' : this.article) + ' ' + this.name;
                    }
                
                    return this.name;
                },

                getWeight: function()
                {
                    if (this.stackable)
                    {
                        return this.weight * this.stackable.amount;
                    }

                    return this.weight;

                },

                isEquippableBy: function(creature)
                {
                    // by default, items are not equippable. Some items, like armour and weapons 
                    // will override this method
                    return false;
                },

                use: function(creature)
                {
                    return { success: false, message: this.getName(true) + ' is not usable' };
                },

                hasAttribute: function(attribute)
                {
                    for (var a=0; a < this.attributes.length; a++)
                    {
                        if (this.attributes[a].toLowerCase() == attribute.toLowerCase())
                        {
                            return true;
                        }
                    }

                    return false;
                },

                removeAttribute: function(attribute)
                {
                    var newAttrs = [];
                    for (var a=0; a < this.attributes.length; a++)
                    {
                        if (this.attributes[a].toLowerCase() != attribute.toLowerCase())
                        {
                            newAttrs.push(this.attributes[a]);
                        }
                    }

                    this.attributes = newAttrs;
                },

                findItemsOfStackableType: function(type, items)
                {
                    for (var i=0; i < items.length; i++)
                    {
                        if ((items[i].stackable) && (items[i].stackable.type == type))
                        {
                            return items[i];
                        }
                    }

                    return null;
                }
                    



		    };  // prototype

		    return (Item);

		}

	]);

})(angular.module('CurseApp'));
