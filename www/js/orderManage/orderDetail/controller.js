/**
 * Created by xianChaoFan on 15/7/10.
 */

starter.controller('orderDetailCtrl', ['$scope','$ionicLoading', '$state', '$location', '$http', '$stateParams','stopDistributionFactory',
    'exchangeFactory',getOrderDetail]);

var orderbegainDate = '';
var totalMoney;
var orderId;

function getOrderDetail($scope,$ionicLoading, $state, $location, $http, $stateParams, stopDistributionFactory, exchangeFactory) {
    orderId = $stateParams.orderId;
    var flag = $stateParams.flag;

    $scope.orderId = orderId;
    $scope.flag = flag;
    $scope.isHaveGift = false;
    $scope.payStyle = false;

    if (flag == 0) { // 未付款
        console.log('flag-----' + flag);
        getNoSendOrderDetailList($scope, $http, orderId,exchangeFactory);
        $scope.noSendDetail = true;
        $scope.sendingDetail = false;
        $scope.finishDetail = false;
        //取消订单
        $scope.cancelOrder = function () {
            cancelOrder($http, $scope,$location,$ionicLoading);
        }

        //在线支付
        $scope.getCharge = function () {
                getCharge($http, $scope,$state);
        }

    } else if (flag == 1) { // 未完结

        getOrderDetailList($scope, $http, orderId,exchangeFactory);
        $scope.noSendDetail = false;
        $scope.sendingDetail = true;
        $scope.finishDetail = false;

        $scope.changeMilk = function () {
            console.log('------换奶------');
            console.log($scope.orderDetail);
            console.log($scope.addUser);
            console.log('orderId---------' + orderId);

            exchangeFactory.setAddUser($scope.addUser);
            exchangeFactory.setMilks($scope.orderDetail);
            exchangeFactory.setOrderId(orderId);
            $state.go("needChange");
        }

        $scope.changeAddress = function () {
            console.log('orderId-----' + orderId);
            $state.go("changeAddress", {"orderId": orderId});
        }

        $scope.beginSend = function () {
            console.log('orderId-----' + orderId);
            $state.go("activeMilk", {"orderId": orderId});
        }
        /**
         * 跳转暂停配送
         */
        $scope.stopDistribution = function (obj) {
            console.log('nihao')
            console.log('stopDistribution-----' + obj[0].detail[0].beginDate + ",," + orderId);
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].orderId == orderId) {
                    stopDistributionFactory.setOrderList(obj[i]);
                }
            }
            $location.path("/stopDistribution");
        }



    } else if (flag == 2){ // 已完结
        getOrderDetailList($scope, $http, orderId, exchangeFactory);

        $scope.noSendDetail = false;
        $scope.sendingDetail = false;
        $scope.finishDetail = true;
    }

    $scope.getInfoLength = function (info) {
        if (info == null) {
            return 0;
        }
        return info.length;
    }

    $scope.moreHandle = function () {
        if ($scope.moreMenu == true) {
            $scope.moreMenu = false;
            return;
        }
        $scope.moreMenu = true;
    }

    $scope.beginDate = function () {
        return orderbegainDate;
    };

    $scope.changeDeliverRules = function (deliverRules) {
        return changeDeliverRules(deliverRules);
    }

    $scope.getRemainMilkCount = function (info) {
        return getRemainMilkCount(info);
    }

    $scope.judgeStateBase = function (stopDate, remain) {
        return judgeStateBase(stopDate, remain);
    }

//    $scope.computeMoney = function (remain, quantity, price) {
//        return computeMoney(remain, quantity, price);
//    }

    $scope.openHeadRightList = function () {
        if ($scope.headRightList == true) {
            $scope.headRightList = false;
            return;
        }
        $scope.headRightList = true;
    }
}

function getNoSendOrderDetailList($scope, $http, orderId,exchangeFactory) {
    console.log('orderId-----' + orderId);
    console.log('查询未付款订单详情列表');

//    var requestHost = "http://192.168.1.89:7070/temporder/getTempOrder";
//    var requestHost = "http://192.168.1.10:8080/kangnuo/temporder/getTempOrder";

    $http.post(http_orderDetailNoSend,
        {"orderId": orderId})
        .success(function (data) {

            if (data.status == "SUCCESS") {
                console.log('查询未付款订单详情列表------成功');
                console.log(data.data);

                var myData = data.data;
                var detail = myData.detail;
                var contact = myData.contact;
                var discount = myData.discount;
                $scope.orderDetail = detail;
                $scope.orderContact = contact;

                if (discount == null) {
                    $scope.isHaveGift = false;
                } else {

                    if (discount[0].gifts == null) {
                        $scope.isHaveGift = false;
                    } else {
                        $scope.isHaveGift = true;
                    }

                    $scope.orderDiscount = discount[0];
                }


                $scope.orderbegainDate = getEspeTyleDate(new  Date(myData.orderDate));
                console.log('orderbegainDate-----' + $scope.orderbegainDate);

                $scope.computeMoney = myData.totalPrice;
            }
        })
        .error(function (data) {
            console.log('查询未付款订单详情列表------失败');
        });
}

function getOrderDetailList($scope, $http, orderId,exchangeFactory) {
    console.log('orderId-----' + orderId);
    console.log('查询未完结订单详情列表');

//    var requestHost = "http://192.168.1.10:8080/kangnuo/order/getOrderById";
    $http.post(http_orderDetailOther,{},
        {params:{"orderId":orderId}})
        .success(function (data) {

            if (data.status == "SUCCESS") {
                console.log('查询未完结订单详情列表------成功');
                var myData = data.data;
                console.log(myData);

                var detail = myData.detail;
                var contact = myData.contact;
                var discount = myData.discount;
                var addUser = myData.addUser;

                $scope.orderData = myData;
                $scope.orderDetail = detail;
                $scope.orderContact = contact;
                $scope.addUser = addUser;


                if (discount == null || discount.length == 0) {
                    $scope.isHaveGift = false;
                } else {

                    if (discount[0].gifts == null) {
                        $scope.isHaveGift = false;
                    } else {
                        $scope.isHaveGift = true;
                    }

                    $scope.orderDiscount = discount[0];
                }


                $scope.orderbegainDate = getEspeTyleDate(new  Date($scope.orderData.orderDate));
                console.log('orderbegainDate-----' + $scope.orderbegainDate);
                $scope.computeMoney = myData.totalPrice;

            }
        })
        .error(function (data) {
            console.log('查询正在配送订单详情列表------失败');
        });
}

// ----------------------取消订单------------------------
function cancelOrder($http, $scope,$location,$ionicLoading) {

    if (orderId) {

        var cancelrequest = http_requestCancelorder+"=" + orderId;
        var userId=window.localStorage.getItem('key');
        var userName=window.localStorage.getItem('userName')

        $http.get(cancelrequest,{"userId":userId,"userName":userName})

            .success(function (data) {
                if (data.status == "SUCCESS") {
                    $location.path("/orderList");
                    getNoSendOrderList($http, $scope);
                    getNoSendList($scope);
                    showSuccess($ionicLoading,'取消订单成功')
                } else {
                        showError($ionicLoading,'无效订单')
                }
            })
            .error(function (data) {
               showError($ionicLoading,'网络失败,请检查网络连接')
            });


    } else {
            showError($ionicLoading,'请选择要取消的订单')
    }
}

// ----------------------在线支付------------------------
function getCharge($http, $scope,$state) {
//    alert(totalMoney)
//    var data = {
//        'orderNo': 'selectedOrder',
//        'channel': 'alipay_wap',
//        'amount': totalMoney,
//        'subject': 1,
//        'body': 1,
//        'description': 1,
//        'successUrl': 'http://192.168.1.89:8100',
//        'cancelUrl': 'http://192.168.1.89:8100'
//    }
//
//
//    $http.post("http://192.168.1.89:7070/payment/getCharge", data)
//        .success(function (data) {
//            console.log(data);
//            pingpp.createPayment(data, function (result, err) {
//                $scope.result = result;
//                $scope.err = err;
//            });
//        })
//        .error(function (data) {
//            console.log('查询未付款订单详情列表------失败');
//        });
    $state.go('payment', {'orderId': orderId,'totalPrice':$scope.computeMoney});

}
