"use strict";

(function(app) {

	app.factory('BodyShape', ['BodyPart',

		function(BodyPart) {

			function BodyShape(parts) {
                this.parts = parts;
			};
			
			BodyShape.prototype = {

                HUMANOID: new BodyShape([ new BodyPart(BodyPart.prototype.HEAD,  0.1, 2),
                                            new BodyPart(BodyPart.prototype.TORSO, 0.6, 1),
                                            new BodyPart(BodyPart.prototype.ARM, 0.1, 0.75),
                                            new BodyPart(BodyPart.prototype.GROIN, 0.05, 1),
                                            new BodyPart(BodyPart.prototype.BUTT, 0.05, 1),
                                            new BodyPart(BodyPart.prototype.LEG, 0.1, 1)
                                        ]),
                QUADRUPED:    new BodyShape([ new BodyPart(BodyPart.prototype.HEAD, 0.1, 2),
                                            new BodyPart(BodyPart.prototype.NECK, 0.05, 2),
                                            new BodyPart(BodyPart.prototype.BODY, 0.55, 1),
                                            new BodyPart(BodyPart.prototype.LEG, 0.2, 1),
                                            new BodyPart(BodyPart.prototype.TAIL, 0.1, 0.5)
                                        ]),
                SNAKE:    new BodyShape([ new BodyPart(BodyPart.prototype.HEAD, 0.2, 2),
                                            new BodyPart(BodyPart.prototype.BODY, 0.7, 1),
                                            new BodyPart(BodyPart.prototype.TAIL, 0.1, 0.5)
                                        ]),
                WINGED_QUADRUPED:   new BodyShape([ new BodyPart(BodyPart.prototype.HEAD, 0.1, 2),
                                            new BodyPart(BodyPart.prototype.NECK, 0.15, 1.5),
                                            new BodyPart(BodyPart.prototype.BODY, 0.4, 1),
                                            new BodyPart(BodyPart.prototype.WING, 0.1, 1),
                                            new BodyPart(BodyPart.prototype.LEG, 0.15, 1),
                                            new BodyPart(BodyPart.prototype.TAIL, 0.1, 0.5)
                                        ]),
                WINGED_HUMANOID: new BodyShape([ new BodyPart(BodyPart.prototype.HEAD,  0.1, 2),
                                            new BodyPart(BodyPart.prototype.TORSO, 0.4, 1),
                                            new BodyPart(BodyPart.prototype.WING, 0.2, 1),
                                            new BodyPart(BodyPart.prototype.ARM, 0.1, 0.75),
                                            new BodyPart(BodyPart.prototype.GROIN, 0.05, 1),
                                            new BodyPart(BodyPart.prototype.BUTT, 0.05, 1),
                                            new BodyPart(BodyPart.prototype.LEG, 0.1, 1)
                                        ]),


			};  // prototype

			return (BodyShape);

		}

	]);
	
}) (angular.module('CurseApp'));
	