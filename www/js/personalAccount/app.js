/**
 * Created by yu on 15-7-13.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('account', {
            url: '/account',
            templateUrl: 'view/personalAccount/account.html'
        })

});