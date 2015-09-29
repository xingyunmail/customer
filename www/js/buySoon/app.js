/**
 * Created by xianChaoFan on 15/7/23.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('buySoon', {
            url: '/buySoon/:milkInfo',
            templateUrl: 'view/buySoon/buySoon.html',
            controller: 'buySoonCtrl'
        })
});