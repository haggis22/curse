"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'shoppeService', 'ItemFactory', 'Creature', 'Shoppe',
		function($scope, $rootScope, $state, errorService, characterService, shoppeService, ItemFactory, Creature, Shoppe) {
			
            $scope.shoppe = null;

            $scope.shoppeTypes = 
            [
                { category: 'weapons', itemName: 'weapon' },
                { category: 'armour', itemName: 'armour' },
                { category: 'potions', itemName: 'potion' },
                { category: 'general', itemName: 'item' }
            ];

            $scope.setDisplay = function(type) {
                $scope.display = type;
            };

            $scope.setDisplay($scope.shoppeTypes[0]);

            $scope.getDisplayItems = function() {

                if (!$scope.shoppe)
                {
                    return [];
                }

                switch ($scope.display.category)
                {
                    case 'weapons':
                        return $scope.shoppe.weapons;

                    case 'armour':
                        return $scope.shoppe.armour;

                    case 'potions':
                        return $scope.shoppe.potions;

                    case 'general':
                        return $scope.shoppe.items;
                
                }  // switch

                return [];

            };

            $scope.pullShoppe = function() {

                shoppeService.shoppe.get({}, 
                    
                    function(response) {

                        var shop = 
                        { 
                            weapons: [],
                            armour: [],
                            potions: [],
                            items: []
                        };
                            
                        response.items.forEach(function(item) {

                            var itemObj = ItemFactory.createItem(item);
                            
                            if ((item.isArmour) || (item.isShield))
                            {
                                shop.armour.push(itemObj);
                            }
                            else if (item.isWeapon)
                            {
                                shop.weapons.push(itemObj);
                            }
                            else if (item.isPotion)
                            {
                                shop.potions.push(itemObj);
                            }
                            else
                            {
                                shop.items.push(itemObj);
                            }

                        });

                        $scope.shoppe = shop;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch shoppe", error) });

                    });

            };

            $scope.pullShoppe();
    

            $scope.buy = function(item)
            {
                if (!characterService.current.canAfford(item))
                {
                    console.debug('Not enough money');
                    return;
                }

                $scope.shoppeError = null;

                shoppeService.purchase.buy({ characterID: characterService.current._id, itemID: item._id }, 

                    function(response) {

                        if (response.success)
                        {
                            // update the character's pack
                            // characterService.current.pack = response.pack;
                            characterService.current.clearPack();
                            response.pack.forEach(function(packItem) { 
                                characterService.current.addItem(ItemFactory.createItem(packItem));
                            });
                            var boughtItem = ItemFactory.createItem(response.item);
                            console.log('Bought ' + boughtItem.getName(true) + ' _id = ' + boughtItem._id);
                        }
                        else
                        {
                            $scope.shoppeError = response.message;
                        }


                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not buy item", error) });

                    });

            }


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

