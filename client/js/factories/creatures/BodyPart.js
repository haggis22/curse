"use strict";

(function(app) {

	app.factory('BodyPart', 

		function() {

			function BodyPart(name, frequency, damageFactor) {
                this.name = name;
                this.frequency = frequency;
                this.damageFactor = damageFactor;
			};
			
			BodyPart.prototype = {

                HEAD: "head",
                TORSO: "torso",
                ARM: "arm",
                GROIN: "groin",
                BUTT: "butt",
                LEG: "leg",
                BODY: "body",
                TAIL: "tail",
                WING: "wing",
                NECK: "neck"

			};  // prototype

			return (BodyPart);

		}

	);
	
}) (angular.module('CurseApp'));
	