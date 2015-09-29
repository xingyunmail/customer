/**
 * Created by sunhao on 15/6/11.
 */

angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {

//    $urlRouterProvider.otherwise('/register');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'view/login/login.html'
            //controller: 'loginCtrl'


        }) //        注册
        .state('register', {
            url: '/register',
            templateUrl: 'view/login/register.html'
            //controller: 'loginCtrl'

        })

});
