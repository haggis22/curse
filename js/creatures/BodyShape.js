"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var BodyShapeModule = function (BodyPart) {

        var BodyShape = function (parts) {
            this.parts = parts;
        }

        BodyShape.HUMANOID = new BodyShape([new BodyPart({ name: BodyPart.HEAD, frequency: 0.1, damageFactor: 2 }),
                                        new BodyPart({ name: BodyPart.TORSO, frequency: 0.6, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.ARM, frequency: 0.1, damageFactor: 0.75 }),
                                        new BodyPart({ name: BodyPart.GROIN, frequency: 0.05, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.BUTT, frequency: 0.05, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.LEG, frequency: 0.1, damageFactor: 1 })
                                    ]);

        BodyShape.QUADRUPED = new BodyShape([new BodyPart({ name: BodyPart.HEAD, frequency: 0.1, damageFactor: 2 }),
                                        new BodyPart({ name: BodyPart.NECK, frequency: 0.05, damageFactor: 2 }),
                                        new BodyPart({ name: BodyPart.BODY, frequency: 0.55, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.LEG, frequency: 0.2, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.TAIL, frequency: 0.1, damageFactor: 0.5 })
                                    ]);

        BodyShape.SNAKE = new BodyShape([new BodyPart({ name: BodyPart.HEAD, frequency: 0.2, damageFactor: 2 }),
                                        new BodyPart({ name: BodyPart.BODY, frequency: 0.7, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.TAIL, frequency: 0.1, damageFactor: 0.5 })
                                    ]);

        BodyShape.WINGED_QUADRUPED = new BodyShape([new BodyPart({ name: BodyPart.HEAD, frequency: 0.1, damageFactor: 2 }),
                                        new BodyPart({ name: BodyPart.NECK, frequency: 0.15, damageFactor: 1.5 }),
                                        new BodyPart({ name: BodyPart.BODY, frequency: 0.4, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.WING, frequency: 0.1, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.LEG, frequency: 0.15, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.TAIL, frequency: 0.1, damageFactor: 0.5 })
                                    ]);

        BodyShape.WINGED_HUMANOID = new BodyShape([new BodyPart({ name: BodyPart.HEAD, frequency: 0.1, damageFactor: 2 }),
                                        new BodyPart({ name: BodyPart.TORSO, frequency: 0.4, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.WING, frequency: 0.2, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.ARM, frequency: 0.1, damageFactor: 0.75 }),
                                        new BodyPart({ name: BodyPart.GROIN, frequency: 0.05, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.BUTT, frequency: 0.05, damageFactor: 1 }),
                                        new BodyPart({ name: BodyPart.LEG, frequency: 0.1, damageFactor: 1 })
                                    ]);

        BodyShape.BEHOLDER = new BodyShape([new BodyPart({ name: BodyPart.HEAD, frequency: 1, damageFactor: 1 })])


        return BodyShape;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('BodyShape', ['BodyPart', BodyShapeModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = BodyShapeModule(
            require(__dirname + '/BodyPart')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
