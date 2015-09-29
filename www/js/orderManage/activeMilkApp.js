/**
 * Created by zhaijin on 15-6-11.
 */
starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state('activeMilk', {
            url: '/activeMilk/:orderId',
            templateUrl: 'view/orderManage/activeMilk/activeMilk.html',
            controller: 'activeMilk'
    });

});
