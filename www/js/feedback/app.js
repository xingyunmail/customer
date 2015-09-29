/**
 * Created by xiaowu on 15/6/25.
 */
angular.module('starter').config(function ($stateProvider, $urlRouterProvider) {
//    $urlRouterProvider.otherwise('/login');
    $stateProvider
        .state('feedback', {
            url: '/feedback',
            templateUrl: 'view/feedback/feedback.html'
//            controller: 'feedbackCtrl'

        })

});
