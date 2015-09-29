/**
 * Created by 84wifi on 15/8/12.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('needChange', {
            url: '/needChange',
            templateUrl: 'view/orderManage/changeMilk/needChange.html',
            controller: 'needChangeCtrl'
        })

        .state('exchangeMilk', {
            url: '/exchangeMilk',
            templateUrl: 'view/orderManage/changeMilk/exchange.html',
            controller: 'exchangeCtrl'
        })

        .state('exchangeConfirm', {
            url: '/exchangeConfirm',
            templateUrl: 'view/orderManage/changeMilk/confirm.html',
            controller: 'exConfirmCtrl'
        })
});

