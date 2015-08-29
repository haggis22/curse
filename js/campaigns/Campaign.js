"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var CampaignModule = function () {

        var Campaign = function (campaign) {

            this._id = campaign._id;
            this.name = campaign.name;
            this.state = campaign.state;
            this.updated = campaign.updated;

        };

        Campaign.prototype.State =
        {
            TAVERN: 1,
            ADVENTURE: 2
        };

        return Campaign;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Campaign', [CampaignModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = CampaignModule();
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
