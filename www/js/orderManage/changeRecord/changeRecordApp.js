/**
 * Created by lining on 15-6-11.
 */


starter.config(function($stateProvider,$urlRouterProvider){
    //订单管理--变更记录页面
     $stateProvider.state('changeRecord', {
        url: '/changeAddress',
        views: {
            'headView': {
                templateUrl: 'view/orderManage/changeRecord/head.html'
            },
            'contentView': {
                templateUrl: 'view/orderManage/changeRecord/averageQuantity.html',
                controller: 'changeRecord'
            },
            'footerView':{
                templateUrl: 'view/orderManage/changeRecord/footer.html',
                controller: ''
            }
        }
    })
});


