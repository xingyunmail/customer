/**
 * Created by yu on 15-7-2.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'view/welcome/welcome.html'
        });

});