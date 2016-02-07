"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ItemModule = function (Value) {

        var Item = function (item) {

            if (item)
            {
                this._id = item._id;
                this.type = item.type;
                this.name = item.name;
                this.article = item.article == null ? 'a' : item.article;

                this.equipped = false;

                this.weight = item.weight == null ? 0 : item.weight;
                this.hands = item.hands == null ? 0 : item.hands;

                this.value = item.value ? item.value : 0;

                this.attributes = item.attributes == null ? [] : item.attributes;

                this.stack = item.stack;
                this.plural = item.plural;
                this.amount = item.amount;
            }

        };

        Item.prototype.getName = function (useDefiniteArticle) {

            if (this.plural) {
                if (this.amount == 1) {
                    return (useDefiniteArticle ? 'the' : this.article) + ' ' + this.name;
                }

                return (useDefiniteArticle ? 'the' : '') + ' ' + this.amount + ' ' + this.plural;
            }


            if (useDefiniteArticle != null) {

                return (useDefiniteArticle ? 'the' : this.article) + ' ' + this.name;
            }

            return this.name;

        };


        Item.prototype.getWeight = function()
        {
            return this.weight * this.amount;
        };

        Item.prototype.isStackable = function() {

            return this.stack != null;

        };


        // by default, items are not equippable. Some items, like armour and weapons 
        // will override this method
        Item.prototype.isEquippableBy = function(creature)
        {
            return false;
        };

        // Items are also not usable
        Item.prototype.use = function(creature)
        {
            return { success: false, message: this.getName(true) + ' is not usable' };
        };

        Item.prototype.hasAttribute = function(attribute)
        {
            for (var a=0; a < this.attributes.length; a++)
            {
                if (this.attributes[a].toLowerCase() == attribute.toLowerCase())
                {
                    return true;
                }
            }

            return false;
        };

        Item.prototype.removeAttribute = function(attribute)
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
        };

        Item.prototype.findItemsOfStackableType = function(type, items)
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

            
        return Item;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
//        angular.module('CurseApp', ['Value']).            // do I need to inject this here as well?
            factory('Item', ['Value', ItemModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = ItemModule(
            require(__dirname + '/Value')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
