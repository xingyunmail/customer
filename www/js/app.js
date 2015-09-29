// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic', 'ui.router','ngCordova','starter.shoppingcar'])

    .run(function ($ionicPlatform, $rootScope, $location, $timeout,$cordovaToast,$ionicLoading) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });


        //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            //判断处于哪个页面时双击退出
            if ($location.path() == '/homePage') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            } else if (history.length > 1) {
                history.back();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);

        $rootScope.$on('loading:show', function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner>' + '加载中...',
                noBackdrop: true
            })
        });

        $rootScope.$on('loading:hide', function () {
            $ionicLoading.hide()
        })

    });



//路由配置
starter.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {

    $urlRouterProvider.otherwise('/homePage');

    $httpProvider.interceptors.push(function ($rootScope) {
        return {
            request: function (config) {
                if(!isInterceptors){
                    $rootScope.$broadcast('loading:show');
                }
                return config
            },
            response: function (response) {
                if(!isInterceptors){
                    $rootScope.$broadcast('loading:hide');
                }
                return response
            }
        }
    })

});
