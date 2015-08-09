"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 'Armour', 'Weapon', 'Potion',
		function($scope, $rootScope, $state, errorService, shoppeService, Armour, Weapon, Potion) {
			
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

                            if ((item.isArmour) || (item.isShield))
                            {
                                shop.armour.push(new Armour(item));
                            }
                            else if (item.isWeapon)
                            {
                                shop.weapons.push(new Weapon(item));
                            }
                            else if (item.isPotion)
                            {
                                shop.potions.push(new Potion(item));
                            }
                            else
                            {
                                shop.items.push(item);
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

                        $scope.character.addItem(item);
                        console.log('Bought ' + item.getName(true) + ' _id = ' + item._id);


                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not buy item", error) });

                    });

            }


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

