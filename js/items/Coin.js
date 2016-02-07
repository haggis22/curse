"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var CoinModule = function (Item) {

        var Coin = function(coin) {

            Item.call(this, coin);

            this.isCoin = true;

        };

        Coin.prototype = Object.create(Item.prototype);

        Coin.prototype.type = 'coin';


        return Coin;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Coin', ['Item', CoinModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = CoinModule(
            require(__dirname + '/Item')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
