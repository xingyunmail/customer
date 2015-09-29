/**
 * Created by xianChaoFan on 15/6/15.
 */
starter.config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
        .state('homePage', {
            url: '/homePage',
            templateUrl: 'view/homePage/home.html',
            controller: 'milkStyleCtrl'
        })
});
