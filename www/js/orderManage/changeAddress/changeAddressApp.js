/**
 * Created by lining on 15-6-11.
 */


starter.config(function($stateProvider,$urlRouterProvider){
    //订单管理--转奶页面
    $stateProvider
        //.state('changeAddress', {
        //    url:'/changeAddress',
        //    templateUrl: 'view/orderManage/changeAddress/changeAddress.html',
        //    controller:'changeAddress'
        //})
        .state('addAddress',{
            url:'/addAddress/:flag',
            templateUrl: 'view/personalCenter/addAddress.html',
            controller: 'PersonalController'
        })

});


