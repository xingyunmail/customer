/**
 * Created by lining on 15/6/11.
 */


starter.controller("changeRecord",function($scope,$http){

    $scope.address = false;
    $scope.prod = false;
    $scope.pause = false;
    $scope.back = true;
    $scope.deliver = false;
    $scope.changeList = [{"prod":"酸奶","number":"20","price":"2.4","changType":"退订商品","changeDate":"2015-06-11"},
                         {"prod":"纯奶","number":"10","price":"3.0","changeType":"退订商品","changeDate":"2015-06-11"},
                         {"prod":"核桃奶","number":"5","price":"2.0","changeType":"退订商品","changeDate":"2015-06-11"}
                        ];
    //$scope.changeList = [{"changType":"更换日配与频率","changeDate":"2015-06-11","prod":"酸奶","dayDeliver":"2","frequency":"天天送"},
    //    {"changType":"更换日配与频率","changeDate":"2015-06-11","prod":"酸奶","dayDeliver":"3","frequency":"天天送"}
    //];
    //$http.get("http://localhost:8080/knPlatform/deliver/getDeliverOrder?startDate=2015-06-12").success(function(response){
    //    $scope.changeList = response.data;
    //    //alert($scope.changeList);
    //});


    var backCount=0;
    angular.forEach($scope.changeList,function(data,index,array){
        backCount = backCount+data.number*data.price;
    });
    $scope.backCount = backCount;

})

starter.controller("getAverageQuantity",function($scope,$http){

    $scope.orderTypes = [{"orderType":"美团","quantity":"450"},{"orderType":"百度外卖","quantity":"200"},{"orderType":"正常订单","quantity":"5000"},
                         {"orderType":"赠奶","quantity":"30"},{"orderType":"报奶","quantity":"25"},{"orderType":"补奶","quantity":"45"}];

});