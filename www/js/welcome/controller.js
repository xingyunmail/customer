/**
 * Created by yu on 15-7-2.
 */

starter.controller('welcomeCtrl',['$http','$cordovaDevice','$ionicPlatform','$state',welcomeFunc]);

function welcomeFunc($http,$cordovaDevice,$ionicPlatform,$state){

    $ionicPlatform.ready(function () {
        isLogin($http,$cordovaDevice,$state);
    });

}


function getCity($http,$state){

    isInterceptors =true;

    if(navigator.geolocation){
        var options = { timeout: 5000 };
        navigator.geolocation.getCurrentPosition(onSuccess,onError,options);
    }else{
        $state.go("homePage");
    }

    function onSuccess(position) {
        var lon = position.coords.longitude;
        var lat = position.coords.latitude;
        $http.get(http_welcomeGetCity,{params: {"lat":lat,"lng":lon}}).
            success(function(data) {
                if(data.status == "SUCCESS"){
                    window.localStorage.setItem("city", data.data["addressComponent"]["city"].substring(0,2));
                    window.localStorage.setItem("district", data.data["addressComponent"]["district"]);
                }
                $state.go("homePage");
            });
    }

    function onError(){
        $state.go("homePage");
    }
}

function isLogin($http,$cordovaDevice,$state){

    isInterceptors = true;
    var key = window.localStorage.getItem("key");

    if(key == null || key == undefined || key == "" || ((key.indexOf("uuid") < 0) && key.length != 16)){

        var uuid = $cordovaDevice.getUUID();
        var uuidkey = "uuid" + uuid;

        $http.post(http_welcomeCheck,{},{params:{"key":uuidkey}}).
            success(function(data){
                if(data.status == "SUCCESS"){
                    window.localStorage.setItem("key",uuidkey);
                    window.localStorage.setItem("loginName",data.data["loginName"]);
                    getCity($http,$state);
                }else{
                    $http.post(http_welcomeAdd,{},{params:{"key":uuidkey}}).
                        success(function(data) {
                            if(data.status == "SUCCESS"){
                                window.localStorage.setItem("key",uuidkey);
                                window.localStorage.setItem("loginName",data.data["loginName"]);
                                getCity($http,$state);
                            }
                        });
                }
            });

    }else{

        getCity($http,$state);
    }

}
