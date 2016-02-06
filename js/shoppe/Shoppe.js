"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var ShoppeModule = function (Value, Item, ItemFactory) {

        var Shoppe = function (itemArray) {

            // convert the array of Javascript objects to actual Item objects, or just an empty list if there are none
            this.items = itemArray ? itemArray.map(function(item) { return ItemFactory.createItem(item); } ) : [];

        };

        return Shoppe;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Shoppe', ['Value', 'Item', 'ItemFactory', ShoppeModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = ShoppeModule(
            require(__dirname + '/../items/Value'),
            require(__dirname + '/../items/Item'),
            require(__dirname + '/../items/ItemFactory')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 

