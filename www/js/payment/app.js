/**
 * Created by ZH on 15/6/17.
 */

starter.config(function ($stateProvider) {
    $stateProvider
        .state('payment', {
            url: '/payment',
            templateUrl: 'view/payment/home.html',
            controller: 'paymentController',
            params: {
                orderId:'',totalPrice:''
            }
        })
});

