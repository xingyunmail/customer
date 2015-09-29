/**
* Created by gudonghui on 15/6/19.
*/
angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {
//    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('userManage',{
            url: '/userManage',
            templateUrl: 'view/userManage/userManage.html'
            //controller: 'userManageCtrl'

        })
//        .state('showResult',{
//            url: '/showResult',
//            templateUrl: 'view/userManage/showResult.html'
//            //controller: 'userManageCtrl'
//
//        })
//        .state('showMessage',{
//            url: '/showMessage',
//            templateUrl: 'view/userManage/showMessage.html'
//            //controller: 'userManageCtrl'
//
//        })



});