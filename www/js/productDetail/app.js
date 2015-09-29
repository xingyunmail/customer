/**
 * Created by ZH on 15/6/11.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('productdetail', {
            url: '/productdetail',
            templateUrl: 'view/productDetail/detail.html',
            controller: 'productCtrl'
        });

});

