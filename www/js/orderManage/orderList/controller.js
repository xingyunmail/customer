/**
 * Created by xianChaoFan on 15/6/23.
 */

starter.controller('orderListCtrl', ['$scope', '$location', '$http', '$state', '$ionicLoading', getOrderList]);

function getOrderList($scope, $location, $http, $state) {

    getNoSendOrderList($http, $scope);
    getSendingOrderList($http, $scope);
    getFinishOrderList($http, $scope);

    //-----------------default----------------
    $scope.orderTyleSelected = '未付款';

    $scope.getNoSendList = function () {
        console.log('------------getNoSendList------------');
        getNoSendList($scope);
    };

    $scope.getSendingList = function () {
        console.log('------------getSendingList------------');
        getSendingList($scope);
    };

    $scope.getFinshingList = function () {
        console.log('------------getFinshingList------------');
        getFinishingList($scope);
    };

    $scope.changeDeliverRules = function (deliverRules) {
        return changeDeliverRules(deliverRules);
    }

    $scope.getRemainMilkCount = function (info, length) {
        return getRemainMilkCount(info, length);
    }

    $scope.judgeStateBase = function (stopDate, remain) {
        return judgeStateBase(stopDate, remain);
    }

    $scope.gotoOrderDetail = function (orderId, flag) {
//        $location.path("/orderDetail");
        $state.go("orderDetail", {"orderId": orderId, "flag": flag});
    }

}

function getNoSendList($scope) {
    $scope.orderInfos = $scope.noSendList;

    if (!$scope.orderInfos) {
        $scope.orderList_empty = true;
        return;
    }

    $scope.orderList_empty = false;
    $scope.noSend = true;
    $scope.sending = false;
    $scope.finish = false;
    $scope.moreMenu = false;
};


function getSendingList($scope) {
    $scope.orderInfos = $scope.sendingList;

    if (!$scope.orderInfos) {
        $scope.orderList_empty = true;
        return;
    }

    $scope.orderList_empty = false;
    $scope.noSend = false;
    $scope.sending = true;
    $scope.finish = false;
    $scope.moreMenu = false;
}

function getFinishingList($scope) {
    $scope.orderInfos = $scope.finishList;
    if (!$scope.orderInfos) {
        $scope.orderList_empty = true;
        return;
    }

    $scope.orderList_empty = false;
    $scope.noSend = false;
    $scope.sending = false;
    $scope.finish = true;
    $scope.moreMenu = false;
}


function getNoSendOrderList($http, $scope) {

    console.log('查询未付款订单列表');

    $http.post(http_orderListNoSend,
        {"customer": {"key": window.localStorage.getItem("key")}})
        .success(function (data) {

            if (data.status == "SUCCESS") {
                console.log('查询未付款订单------成功');
                console.log(data.data);
                $scope.noSendList = data.data;
                getNoSendList($scope);
            }
        })
        .error(function (data) {
            console.log('查询未付款订单------失败');
            getNoSendList($scope);

        });

}


function getSendingOrderList($http, $scope) {

    console.log('查询未完结订单列表');

    $http.post(http_orderListSending,
        {"customer": {"key": window.localStorage.getItem("key")}, "detail": [
            {"endDate": ""}
        ]})
        .success(function (data) {

            if (data.status == "SUCCESS") {
                console.log('查询未完结订单------成功');
                console.log(data.data);
                $scope.sendingList = data.data;
            }
        })
        .error(function (data) {
            console.log('查询未完结订单------失败');
        });
}

function getFinishOrderList($http, $scope) {

    console.log('查询已完结订单列表');

    $http.post(http_orderListFinish,
        {"customer": {"key": window.localStorage.getItem("key")}, "detail": [
            {"endDate": new Date().Format("yyyy-MM-dd")}
        ]})
        .success(function (data) {

            if (data.status == "SUCCESS") {
                console.log('查询已完结订单------成功');
                console.log(data.data);
                $scope.finishList = data.data;
            }
        })
        .error(function (data) {
            console.log('查询已完结订单------失败');
        });
}


//function scrollWatch($scope) {
//    var scrollFunc = function (e) {
//        e = e || window.event;
//        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
//            if (e.wheelDelta > 0) { //当滑轮向上滚动时
//                console.log("滑轮向上滚动");
//            }
//            if (e.wheelDelta < 0) { //当滑轮向下滚动时
//                console.log("滑轮向下滚动");
//            }
//        } else if (e.detail) {  //Firefox滑轮事件
//            if (e.detail > 0) { //当滑轮向上滚动时
//                console.log("滑轮向上滚动");
//            }
//            if (e.detail < 0) { //当滑轮向下滚动时
//                console.log("滑轮向下滚动");
//            }
//        }
//    }
//    //给页面绑定滑轮滚动事件
//    if (document.addEventListener) {//firefox
//        document.addEventListener('DOMMouseScroll', scrollFunc, false);
//    }
//    //滚动滑轮触发scrollFunc方法  //ie 谷歌
//    window.onmousewheel = document.onmousewheel = scrollFunc;
//}

