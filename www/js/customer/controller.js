/**
 * Created by zzq on 15-6-30.
 */

starter.controller('Location', ['$scope', '$http', getLocation]);
function getLocation($scope,$http) {
    var key = getStorage("key");
    var city = getStorage("city");

    if(key !=null && key.length>0){
        if(key.substring(0,4)=="uuid"){
            $scope.isok = false;
            $http.post(http_getCustomerInfoByKey,{},{params:{"key":key}}).success(function(data){
                if(data.status =="SUCCESS"){
                    $scope.money = data.data.wallet.money;
                }
            }).error(function(data){
                console.info("error");
            });
        }else{
            $scope.isok= true;
            $http.post(http_getCustomerInfoByKey,{},{params:{"key":key}}).success(function(data){
                if(data.status =="SUCCESS"){
                    $scope.mobile = data.data.loginName;
                    $scope.money = data.data.wallet.money;
                }
            }).error(function(data){
                console.info("error");
            });
        }
    }else{
        $scope.isok = false;
        $scope.money='';
    }


    $http.post(http_getPhoneByCity,{"city":city}).success(function(data){
        $scope.tel = data.data.phone+"";
    }).error(function(data){
        console.info("error");
    });
}

