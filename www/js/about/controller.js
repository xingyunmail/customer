/**
 * Created by gudonghui on 15/7/23.
 */
starter.controller('aboutCtrl',function($ionicLoading,$scope,$location,$interval,$http,$cordovaAppVersion) {


    //   	获取客服电话
    getTel($http,$scope,requestUrl);

    //  获取客服电话
    function getTel($http,$scope,requestUrl)
    {
        var city=getStorage('city');
//        $http.get(requestUrl+'custservice/getPhone?city='+city)
        $http.post(http_getPhoneByCity,{"city":city})

            .success(function(data) {
                console.log(data)
                if(data.status == "SUCCESS"){

//                    $scope.tels=data.data['phone']
                    $scope.tel = data.data.phone+"";


                }
            })
    }
    $scope.praise=function()
    {
        $http.post(requestUrl)

            .success(function(data) {
                console.log(data)
                if(data.status == "SUCCESS"){


                }
            })

            .error(function(data) {




            })


    }

    //获取版本号
//    $cordovaAppVersion.getVersionNumber().then(function (version) {
//        alert(11);
//        var appVersion = version;
//        alert(appVersion)
//    });


    document.addEventListener("deviceready", function () {
        $cordovaAppVersion.getVersionNumber().then(function (version) {
            $scope.appVersion  = version;

        });
    }, false);
})