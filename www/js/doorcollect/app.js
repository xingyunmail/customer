/**
 * Created by yu on 15-6-12.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('verifyphone', {
            url: '/verifyphone',
            templateUrl: 'view/doorcollect/verifyphone.html'
        })

        .state('ordercontent', {
            url: '/ordercontent',
            templateUrl: 'view/doorcollect/ordercontent.html'
        })

        .state('ordercompletion', {
            url: '/ordercompletion',
            templateUrl: 'view/doorcollect/ordercompletion.html'
        })

});