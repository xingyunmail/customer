/**
 * Created by zh on 15-7-06.
 */
starter.config(function($stateProvider,$urlRouterProvider){
    //订单管理--停止配送页面
    $stateProvider
        .state('stopDistribution', {
            url:'/stopDistribution',
            templateUrl: '/view/orderManage/StopDistribution/StopDistribution.html',
            controller: 'stopDistributionController'
        })
});


