/**
 * Created by zzq on 15-6-12.
 */
angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('customer', {
            url: '/customer',
            templateUrl: 'view/customer/center.html',
            controller:'Location'
        })

});
