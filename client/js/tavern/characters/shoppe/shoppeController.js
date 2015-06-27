"use strict";

(function(app) {


	app.controller('tavern.shoppeController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 
		function($scope, $rootScope, $state, errorService, shoppeService) {
			
            $scope.shoppe = null;

            $scope.pullShoppe = function() {

                shoppeService.get({}, 
                    
                    function(response) {

                        $scope.shoppe = response;

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


        }   // end controller function

	]);			
	
}) (angular.module('CurseApp'));

