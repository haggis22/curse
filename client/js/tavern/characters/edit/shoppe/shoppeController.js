"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'shoppeService', 'ItemFactory', 'Creature', 'Shoppe',
		function($scope, $rootScope, $state, errorService, characterService, shoppeService, ItemFactory, Creature, Shoppe) {
			
            $scope.shoppe = null;
            $scope.shoppeService = shoppeService;

            $scope.getDisplayItems = function() {

                if (!$scope.shoppe)
                {
                    return [];
                }

                switch (shoppeService.display.category)
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
                            
                            if ((itemObj.isArmour) || (itemObj.isShield))
                            {
                                shop.armour.push(itemObj);
                            }
                            else if (itemObj.isWeapon)
                            {
                                shop.weapons.push(itemObj);
                            }
                            else if (itemObj.isPotion)
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
                    $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not buy " + item.getName(true), "Not enough money") });
                    return;
                }

                $scope.shoppeError = null;

                shoppeService.purchase.buy({ characterID: characterService.current._id, itemID: item._id }, 

                    function(response) {

                        $scope.pullCharacter(characterService.current._id);

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not buy item", error) });

                    });

            }


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

