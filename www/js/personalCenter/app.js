/**
 * Created by ZH on 15/6/17.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('address', {
            url: '/address',
            templateUrl: 'view/personalCenter/address.html',
            controller: 'PersonalController'
        }).state('addaddress', {
            url: '/addaddress/:flag',
            templateUrl: 'view/personalCenter/addAddress.html',
            controller: 'PersonalAddressController'
        })
});

