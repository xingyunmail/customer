/**
 * Created by yu on 15-7-13.
 */

starter.controller('accountCtrl',['$scope','$http','$cordovaToast',personalAccount]).filter("paytypeFilter",function(){


    var filterfun = function(payType, sep) {
        sep = sep || " ";
        payType = payType ||"";
        var result = "";

        switch(payType)
        {
            case "BACKMILK":
                result = "退奶";
                break;
            default:
                result = "无";
        }
        return result;
    };
    return filterfun;

});

function personalAccount($scope,$http,$cordovaToast){

    var currentPage = 1;
    var limit = 10;
    $scope.items = [];
    $scope.noMoreData = false;

    $scope.loadMore = function () {
        getMoney($scope,$http,$cordovaToast,currentPage,limit);
        currentPage += 1;
    }
}

function getMoney($scope,$http,$cordovaToast,currentPage,limit){

    var key = window.localStorage.getItem("key");

    $http.post(http_personAccountGetinfo,{},{params:{"key":key}}).success(function(data){

        if(data.status =="SUCCESS"){
            $scope.money = data.data.wallet.money;
        }else{
            $scope.money = 0;
        }
    });

    $http.get(http_personAccountGetPaylog,{params : {"key":key,"startNum":currentPage,"limit":limit}}).
        success(function(data){
            if(data.status == "SUCCESS"){
                $scope.money = data.data["wallet"].money;
                $scope.accountDetailList = data.data["wallet"].payLog;
                if($scope.accountDetailList.length > 0){
                    $scope.items = $scope.items.concat($scope.accountDetailList);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }else{
                $scope.noMoreData = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $cordovaToast.showShortBottom("没有更多数据了");
            }
        });
}
