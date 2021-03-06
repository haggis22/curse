"use strict";

(function (mod) {

    mod.factory('errorService', function () {

        return {

            parse: function (header, errorObject) {

                var response =
                {
                    display: true,
                    header: header,
                    httpStatusCode: errorObject.status,
                    errors: []
                };

                if (typeof errorObject == 'string')
                {
                    response.errors.push(errorObject);
                }
                else
                {

                    // In Chrome/Firefox, certain types of error will have a status of 0: Aborted requests, CORS errors,
                    // invalid server names, etc.  Working a way to see what is actually in there
                    if (errorObject.status === 0) {

                    }
                    else {

                        if (errorObject.data) {

                            response.responseCode = errorObject.data["error_code"];

                            if (errorObject.data.error_message != null) {
                                response.errors.push(errorObject.data.error_message);
                            }
                            if (errorObject.data.error != null) {
                                response.errors.push(errorObject.data.error);
                            }

                        }
                        else if (errorObject.description) {
                            response.errors.push(errorObject.description);
                        }


                    }

                }

                if (response.errors.length == 0) {
                    response.errors.push("No details available.");
                }

                return response;


            }

        };


    });

})(angular.module('dshell.common'));





