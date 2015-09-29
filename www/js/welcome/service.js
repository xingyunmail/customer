/*


starter.service('myHttpInterceptor', function($q,$cordovaNetwork) {

    return {
        // optional method
        'request': function(config) {
            // do something on success
            alert($cordovaNetwork.isOnline());
            return config;
        },

        // optional method
        'requestError': function(rejection) {
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            return $q.reject(rejection);
        },

        // optional method
        'response': function(response) {
            // do something on success
            return response;
        },

        // optional method
        'responseError': function(rejection) {
            // do something on error
            if (canRecover(rejection)) {
                return responseOrNewPromise;
            }
            return $q.reject(rejection);
        }
    };

});

starter.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
}]);
*/
