/**
 * Created by ZH on 15/6/17.
 */


starter.controller('paymentController', ['$scope', '$ionicPopup', '$location', '$http', '$stateParams', '$timeout',

    function ($scope, $ionicPopup, $location, $http, $stateParams, $timeout) {

        $scope.chargeModel = {};
        $scope.info = {'useLeft': false, 'channel': ''};
        $scope.wallet = 0;
        $scope.onlinePay = $stateParams.totalPrice;
        $scope.leftPay = 0;
        $scope.orderId = $stateParams.orderId;
        $scope.totalPrice = $stateParams.totalPrice;

        var customerKey = window.localStorage.getItem("key");

        $http.post(http_getCustomerAccountMoney, {
                'key': customerKey
            }
        )
            .success(function (data) {
                if (data.status == "SUCCESS") {
                    $scope.wallet = data.data.wallet.money;
                }

            });

        //private String orderNo;
        //private String appId;
        //private PayChannel channel;
        //private int amount;//结算金额
        //private String client_ip;//客户端ip
        //private String currency;//结算货币类型
        //private String subject;//商品标题（ 32 个字节）
        //private String body;//商品的描述信息，该参数最长为 128 个 Unicode 字符，yeepay_wap 对于该参数长度限制为 100 个 Unicode 字符
        //private String timeExpire;//订单失效时间
        //private String description;

        $scope.changeUseLeft = function () {
            if ($scope.info.useLeft) {
                if ($scope.totalPrice > $scope.wallet) {
                    $scope.leftPay = $scope.wallet;
                    $scope.onlinePay = $scope.totalPrice - $scope.wallet;
                } else {
                    $scope.leftPay = $scope.totalPrice;
                    $scope.onlinePay = 0;
                }
            } else {
                $scope.leftPay = 0;
                $scope.onlinePay = $scope.totalPrice;
            }
        }


        $scope.submit = function () {
            if ($scope.info.useLeft) {
                if ($scope.wallet >= $scope.totalPrice) {
                    showUseLeftPop();
                } else {
                    showChargePop();
                }
            } else {
                showChargePop();
            }

        };

        function showUseLeftPop() {
            var confirmPopup = $ionicPopup.confirm({
                title: '提醒',
                template: '确定使用余额支付￥' + ($scope.totalPrice / 100).toFixed(2) + "元",
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    $http.post(http_customerPayForOrder, {
                            'customerKey': window.localStorage.getItem("key"),
                            'orderId': $scope.orderId
                        }
                    )
                        .success(function (data) {
                            if (data.status == "SUCCESS") {
                                alert("付款成功");
                            }
                        });


                }
            });
        }

        function showChargePop() {
            var message = "";

            if ($scope.leftPay > 0) {
                message = "余额支付￥" + ($scope.leftPay / 100).toFixed(2) + "元<br>在线支付￥" + ($scope.onlinePay / 100).toFixed(2) + "元";
            } else {
                message = "在线支付￥" + ($scope.onlinePay / 100).toFixed(2) + "元";
            }

            var data = {
                'channel': $scope.info.channel,
                'amount': $scope.onlinePay,
                'subject': 'subject',
                'body': 'body',
                'description': 'description',
                'orderId': $scope.orderId,
                'customerKey': customerKey,
                'chargeType': 'PAY'
            }

            var confirmPopup = $ionicPopup.confirm({
                title: '提醒',
                template: message,
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function (res) {
                if (res) {

                    $http.post(http_getCharge, data)
                        .success(function (data) {
                            window.setInterval(refreshOrder, 1000);
                            var extraInfo = cordova.require('com.kangnuo.kangnuopay.KangnuoPay');

                            extraInfo.getExtra(function (message) {
                                console.log("========================"+1);
                            }, function (message) {
                                console.log("========================"+2);
                            }, data);
                        })
                        .error(function (data) {
                            console.log(JSON.stringify(data));
                            console.log('获取支付对象失败');
                        });

                }
            });


        }


        function refreshOrder() {
            $http.post(http_orderDetailNoSend, {
                    'orderId': $scope.orderId
                }
            )
                .success(function (data) {
                    if (data.status == "SUCCESS") {
                        if (data.data.payMethod != null && data.data.payMethod.length > 0) {
                            console.log("支付成功！");
                        }
                    }
                });
        }

    }]);





