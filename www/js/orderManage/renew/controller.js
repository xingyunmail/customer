/**
 * 续订页面
 * Created by sunhao on 15/7/25.
 */
starter.controller('renewOrderCtrl',['$scope','$http','$state','$ionicPopup','shopCarFactory',function($scope,$http,$state,$ionicPopup,shopCarFactory){


    $scope.clickRenewButron = function ()
    {
        //1.验证订单中得产品是否依旧存在，参数：订单ID。2.查出顶大信息后，构建出新订单数据。价格修改，事件修改。

        //$http.post("http://192.168.1.59:8080/order/renew", {"orderId":"ay00008-150709"}).success(function (responseData) {
        //    if (responseData.status == "SUCCESS")
        //    {
        //
        //        //3，将新数据设置到Factory中，跳转到订单确认页面。
        //        console.log("success!");
        //        shopCarFactory.setDetails(responseData.data.detail);
        //        //4，set 总价
        //        setRenewTotalPrice(shopCarFactory,responseData.data.detail);
        //        $state.go("confirmOrder",{"page":"renewOrder"});
        //
        //    }
        //    else if(responseData.status == "NORECORD")
        //    {
        //        var confirmPopup = $ionicPopup.alert({
        //            title: '<i class="ion-information-circled">提示</i>',
        //            template: '此订单部分产品已停卖，不能续订',
        //            okText: "确定",
        //            okType:'button-kangnuo',
        //        });

                //var alertPopup = $ionicPopup.alert({
                //    title: '提示',
                //    template: '此订单部分产品已停卖，不能续订'
                //});
                //alertPopup.then(function (res) {
                //    console.log('Thank you for not eating my delicious ice cream cone');
                //});

        //    }
        //});


    }
}]);

function setRenewTotalPrice(shopCarFactory,detail)
{

    if(detail.length > 0)
    {
        var totalPrice = 0;
        for(var i=0;i<detail.length;i++)
        {
            totalPrice += Number(detail[i].quantity*detail[i].price*detail[i].deliverDays);
        }
        shopCarFactory.setPrice(totalPrice);
    }
}