"use strict";

var Value = require(__dirname + '/Value');

var Item = function (item) {

    this.type = item.type;
    this.name = item.name;
    this.article = item.article == null ? 'a' : item.article;

    this.frequency = item.frequency == null ? 1 : item.frequency;
    this.equipped = false;

    this.weight = item.weight == null ? 0 : item.weight;
    this.hands = item.hands == null ? 0 : item.hands;

    this.value = new Value(item.value);
     
    this.attributes = item.attributes == null ? [] : item.attributes;

    if (item.stackable) {
        this.stackable =
        {
            type: item.stackable.type,
            plural: item.stackable.plural,
            amount: item.stackable.amount
        };
    }


};

Item.prototype.getName = function (useDefiniteArticle) {
    var text = '';

    if (this.stackable) {
        if (this.stackable.amount == 1) {
            return (useDefiniteArticle ? 'the' : this.article) + ' ' + this.name;
        }

        return (useDefiniteArticle ? 'the' : '') + ' ' + this.stackable.amount + ' ' + this.stackable.plural;
    }


    if (useDefiniteArticle != null) {
        return (useDefiniteArticle ? 'the' : this.article) + ' ' + this.name;
    }

    return this.name;
};


Item.prototype.getWeight = function()
{
    if (this.stackable)
    {
        return this.weight * this.stackable.amount;
    }

    return (this.weight ? this.weight : 0);

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
                    
module.exports = Item;
