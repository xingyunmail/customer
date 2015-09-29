/**
 * Created by 84wifi on 15/6/15.
 */

starter.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('location', {
            url: '/area',
            views: {
//                'headView': {
//                    templateUrl: '/view/login/head.html'
//                },
                'contentView': {

                    templateUrl: 'view/cityLoc/area.html',
                    controller: ''
                }
            }
        })



});

