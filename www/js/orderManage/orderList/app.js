/**
 * Created by xianChaoFan on 15/6/23.
 */
starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('orderList',{
            url: '/orderList',
            templateUrl: 'view/orderManage/orderList/orderList.html',
            controller: 'orderListCtrl'
        })

        .state('changeAddress', {
            url: '/changeAddress/:orderId',
            templateUrl: '/view/orderManage/changeAddress/changeAddress.html',
            controller: 'changeAddress'

        })

});
