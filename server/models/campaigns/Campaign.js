"use strict";

var Campaign = function (campaign) {

    this.id = campaign._id;
    this.name = campaign.name;
    this.state = campaign.state;
    this.updated = campaign.updated;

};

Campaign.prototype.State =
{
    TAVERN: 1,
    ADVENTURE: 2
};

		
module.exports = Campaign;
