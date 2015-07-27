"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ShieldModule = function (Item, BodyShape) {

        var Shield = function(shield) {

            Item.call(this, shield);

            this.isShield = true;

            if (typeof shield.damage === 'number')
            {
                this.damage = { min: shield.damage, max: shield.damage };
            }
            else 
            {
                this.damage = shield.damage;
            }

            this.hands = shield.hands == null ? 1 : shield.hands;

        };

        Shield.prototype = Object.create(Item.prototype);

        Shield.prototype.use = function (creature) {
            // see how many hands free the character has
            var items = creature.getItems();

            var handsInUse = 0;

            // count how many hands the character is already using
            items.forEach(function (item) {

                if (item.equipped && !items.isShield) {
                    handsInUse += item.hands;
                }
            });

            if (handsInUse + this.hands > creature.hands) {
                return { success: false, message: creature.getName(true) + ' does not have enough hands free to equip ' + this.getName(true) + '.' };
            }

            // unequip any other item the creature is using that is considered a shield

            items.forEach(function (item) {
                if (item.isShield) {
                    item.equipped = false;
                }
            });

            this.equipped = true;

            return { success: true };


        };

        Shield.prototype.getProtection = function()
        {
            if (typeof this.damage === 'number')
            {
                return this.damage;
            }
            else
            {
                return Dice.rollDie(this.damage.min, this.damage.max);
            }

        };

        Shield.prototype.isEquippableBy = function(creature)
        {
            return creature.isShape([BodyShape.HUMANOID, BodyShape.WINGED_HUMANOID]) && creature.useWeapons;
        };

        return Shield;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Shield', ['Item', 'BodyShape', ShieldModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = ShieldModule(
            require(__dirname + '/Item'),
            require(__dirname + '/../creatures/BodyShape')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
