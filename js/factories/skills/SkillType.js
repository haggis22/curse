"use strict";

(function(app) {

	app.factory('SkillType', 

		function() {

			function SkillType(id, name, inherits) {
                this.id = id;
                this.name = name;
                this.inherits = inherits == null ? [] : inherits;
			};

            SkillType.prototype = 
            {
                ID_MELEE: 1,
                ID_SWORD: 2,
                ID_MAGIC: 3,
                ID_FAITH: 4,

                getID: function()
                {
                    return this.id;
                },

                getName: function()
                {
                    return this.name;
                },

                getSkillType: function(typeID)
                {
                    return SkillType.prototype[typeID];
                }
                        
            };  // prototype

            SkillType.prototype[SkillType.prototype.ID_MELEE] = new SkillType(SkillType.prototype.ID_MELEE, 'melee', []);
            SkillType.prototype[SkillType.prototype.ID_SWORD] = new SkillType(SkillType.prototype.ID_SWORD, 'swordfighting', [ SkillType.prototype_ID_MELEE ]);
            SkillType.prototype[SkillType.prototype.ID_MAGIC] = new SkillType(SkillType.prototype.ID_MAGIC, 'magic', [ SkillType.prototype_ID_MAGIC ]);
            SkillType.prototype[SkillType.prototype.ID_FAITH] = new SkillType(SkillType.prototype.ID_MAGIC, 'faith', [ SkillType.prototype_ID_FAITH ]);

			return (SkillType);

		}

	);
	
}) (angular.module('CurseApp'));
	