"use strict";

(function (app) {

    app.factory('Stat',

        function () {

            function Stat(stat) {

                if (stat) {
                    this.value = stat.value || 0;
                    this.max = stat.max || 0;
                    this.adjust = stat.adjust || 0;
                }
                else {
                    this.value = this.max = this.adjust = 0;
                }
            };

            Stat.stats = ['str', 'dex', 'int', 'pie'];

            Stat.statsOrDefault = function (otherStats) {

                var myStats = {};

                Stat.stats.forEach(function (stat) {

                    myStats[stat] = otherStats == null ? new Stat(null) : new Stat(otherStats[stat]);

                });

                return myStats;

            };

            return Stat;

        }
    );

}) (angular.module('CurseApp'));
