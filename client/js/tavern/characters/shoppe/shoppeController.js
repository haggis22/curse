"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 'ItemFactory', 
		function($scope, $rootScope, $state, errorService, shoppeService, ItemFactory) {
			
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

                shoppeService.purchase.buy({ characterID: $scope.character._id, itemID: item._id }, 

                    function(response) {

                        if (response.success)
                        {
                            var boughtItem = ItemFactory.createItem(response.item);
                            
                            $scope.character.addItem(boughtItem);

                            console.log('Bought ' + boughtItem.getName(true) + ' _id = ' + boughtItem._id);
                        }
                        else
                        {
                            console.error(response.message);
                        }


                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not buy item", error) });

                    });

            }


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

