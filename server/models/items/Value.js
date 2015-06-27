"use strict";


var Value = function (value) {

    for (var v = 0; v < Value.denominations.length; v++)
    {
        var denom = Value.denominations[v];

        this[denom] = (value == null) ? 0 : (value[denom] ? value[denom] : 0);
    }

};

Value.denominations = ['gold', 'silver', 'copper'];


module.exports = Value;
