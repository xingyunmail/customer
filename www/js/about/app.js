angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {

//    $urlRouterProvider.otherwise('/register');
    $stateProvider
        .state('about', {
            url: '/about',
            templateUrl: 'view/about/about.html'

        })


});
