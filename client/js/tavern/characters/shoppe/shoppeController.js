"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'shoppeService', 'ItemFactory', 'Creature', 'Shoppe',
		function($scope, $rootScope, $state, errorService, characterService, shoppeService, ItemFactory, Creature, Shoppe) {
			
            $scope.shoppe = null;

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
                            var result = Shoppe.prototype.buyItem(characterService.current, item);
                            if (result.success)
                            {
                                console.log('Bought ' + result.item.getName(true) + ' _id = ' + result.item._id);
                            }
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

