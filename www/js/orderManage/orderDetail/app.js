/**
 * Created by xianChaoFan on 15/7/10.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('orderDetail',{
            url: '/orderDetail/:orderId/:flag',
            templateUrl: 'view/orderManage/orderDetail/orderDetail.html',
            controller: 'orderDetailCtrl'
        })

});
