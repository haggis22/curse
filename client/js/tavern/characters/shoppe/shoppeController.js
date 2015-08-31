"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 'ItemFactory', 'Creature',
		function($scope, $rootScope, $state, errorService, shoppeService, ItemFactory, Creature) {
			
            // calls the method in tavern.singleController
            $scope.pullCharacter($scope.characterID);

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
    
            $scope.cash = function() {
                return $scope.character? $scope.character.countMoney() : 0;
            };


            $scope.buy = function(item)
            {
                if (item.value.getCoppers() > $scope.character.countMoney())
                {
                    console.debug('Not enough money');
                    return;
                }

                $scope.shoppeError = null;

                shoppeService.purchase.buy({ characterID: $scope.character._id, itemID: item._id }, 

                    function(response) {

                        if (response.success)
                        {
                            $scope.character = new Creature(response.character);
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

