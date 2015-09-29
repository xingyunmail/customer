/**
 * Created by yu on 15-7-7.
 */
starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('changeDailyDelivery', {
            url: '/changeDailyDelivery',
            templateUrl: 'view/orderManage/changeDailyDelivery/changeDailyDelivery.html',
            controller: 'changDailyDeliveryCtrl'
        })

});