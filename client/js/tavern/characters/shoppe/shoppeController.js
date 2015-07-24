"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 'Armour',
		function($scope, $rootScope, $state, errorService, shoppeService, Armour) {
			
            $scope.shoppe = null;

            $scope.pullShoppe = function() {

                shoppeService.get({}, 
                    
                    function(response) {

                        var shop = 
                        { 
                            items: []
                        };
                            
                        response.items.forEach(function(item) {

                            if (item.isArmour)
                            {
                                shop.items.push(new Armour(item));
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
    
            $scope.isArmour = function(item)
            {
                return item.isArmour || item.isShield;
            }

            $scope.buy = function(item)
            {
                console.log('Bought ' + item.getName(true) + ' _id = ' + item._id);
            }


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

