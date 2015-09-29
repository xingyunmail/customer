/**
 * Created by sunhao on 15/6/11.
 */
var shoppingcar = angular.module('starter.shoppingcar', []);

shoppingcar.config(function ($stateProvider) {

    $stateProvider
        .state('shoppingcar', {
            url: '/shoppingcar',
            templateUrl: 'view/shoppingcar/car.html',
            controller: ''

        })
        .state('confirmOrder', {
            url: '/confirmOrder',
            templateUrl: 'view/shoppingcar/confirmOrder.html',
            controller: '',
            params:{
                "value":"",
                "page":""
            }
        })
        .state('selectAddr', {
            url: '/selectAddr',
            templateUrl: 'view/shoppingcar/selectAddress.html',
            controller: ''
        })
        .state('newAddress', {
            url: '/newAddress',
            templateUrl: 'view/shoppingcar/newAddress.html',
            controller: ''
        })


});

