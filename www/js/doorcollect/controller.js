/**
 * Created by yu on 15-6-11.
 */

starter.controller('doorcollectCtrl',['$scope','$interval','$timeout','$http','$state','$ionicPopup','$cordovaToast','shopCarFactory',doorCollect]);

function doorCollect($scope,$interval,$timeout,$http,$state,$ionicPopup,$cordovaToast,shopCarFactory) {

    $scope.data = {};
    var contact = shopCarFactory.getAddress();

    $scope.phone = contact.phone;
    $scope.data.newPhone = contact.phone;
    $scope.loginPhone = contact.phone;
    $scope.data.newLoginPhone = $scope.loginPhone;

    //verifyphone.html发送短信
    $scope.getVerifyCode = function(){
        getVerifyCode($scope,$interval,$timeout,$http,$scope.phone);
    };

    $scope.data.key = window.localStorage.getItem("key");

    //verifyphone.html修改手机号码,同时修改地址信息手机号码
    $scope.modifyPhone = function(){

        document.addEventListener("backbutton", function (){
            history.back();
        }, false);

        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.newPhone">',
            title: '手机号码修改',
            scope: $scope,
            cordovaToast: $cordovaToast,
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {

                        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                        if(!phoneReg.test($scope.data.newPhone)){
                            $cordovaToast.showShortBottom("请输入正确得手机号码");
                            e.preventDefault();
                        }else if($scope.phone == $scope.data.newPhone){
                            $cordovaToast.showShortBottom("手机号码未修改");
                            e.preventDefault();
                        }else{
                            $http.post(http_doorcollectUpdatePhone,{},{params:{"key":$scope.data.key,"contactId":$scope.data.contactId,"phone":$scope.data.newPhone}}).
                                success(function(data){
                                    if(data.status == "SUCCESS"){
                                        contact.phone = $scope.data.newPhone;
                                        shopCarFactory.setAddress(contact);
                                        $cordovaToast.showShortBottom("修改成功");
                                        return $scope.data.newPhone;
                                    }else{
                                        e.preventDefault();
                                    }
                                });
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            $scope.phone = $scope.data.newPhone;
            $scope.loginPhone = $scope.data.newPhone;
        });
    };

    //verifyphone.html验证手机号码
    $scope.judgeVerifyCode = function(){

        var code = $scope.verifyCode;
        var localCode = $scope.localCode;
        if(code == undefined || code == ""){
            $cordovaToast.showShortBottom("请输入短信校验码");
            return false;
        }else if(code == localCode){
            $scope.localCode = "";
            $scope.loginPhone = $scope.phone;
            sendOrderMsg($http,$state,shopCarFactory,$cordovaToast);
            return true;
        }else{
            $cordovaToast.showShortBottom("短信校验码错误");
            return false;
        }

    };

    //ordercontent.html发送短信
    $scope.contentGetVerifyCode = function(){

        var loginName = $scope.loginPhone;

        $http.post(http_doorcollectCheck,{},{params:{"loginName":loginName}}).
            success(function(data) {
                if(data.status == "SUCCESS"){
                    getVerifyCode($scope,$interval,$timeout,$http,loginName);
                } else{
                    $cordovaToast.showShortBottom("该手机已被注册,请直接登陆或选择其他号码注册");
                }
            });
    };

    //verifyphone.html验证手机号码
    $scope.contentJudgeVerifyCode = function(){

        var code = $scope.verifyCode;
        var localCode = $scope.localCode;

        if(code == undefined || code == ""){
            $cordovaToast.showShortBottom("请输入短信校验码");
            return false;
        }else if(code == localCode){
            $scope.localCode = "";
            return true;
        }else{
            $cordovaToast.showShortBottom("短信校验码错误");
            return false;
        }
    };

    //ordercontent.html注册提交按钮
    $scope.btnSubmit = function(){

        if(!$scope.contentJudgeVerifyCode()){
            return;
        }

        var password = $scope.password;
        var repassword = $scope.repassword;

        if(password == undefined || password == ""){
            $cordovaToast.showShortBottom("请输入密码");
        }else if(password.length <6 || password.length >12){
            $cordovaToast.showShortBottom("请输入6-12位的密码");
        }else if(password != repassword){
            $cordovaToast.showShortBottom("两次密码不同");
        }else{
            if($scope.data.key.substring(0,4) == "uuid"){
                $http.post(http_doorcollectTmpTocust,{},{params:{"key":$scope.data.key,"loginName":$scope.phone,"password":repassword}}).
                    success(function(data){
                        if(data.status == "SUCCESS"){
                            window.localStorage.setItem("key",data.data["key"]);
                            $cordovaToast.showShortBottom("注册成功");
                            $state.go("ordercompletion");
                        }else{
                            $cordovaToast.showShortBottom("注册失败,请重新操作");
                        }
                    });
            }

        }

    };

    //ordercontent.html修改手机号码
    $scope.modifyLoginPhone = function(){

        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.newLoginPhone">',
            title: '手机号码修改',
            scope: $scope,
            cordovaToast: $cordovaToast,
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {

                        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                        if(!phoneReg.test($scope.data.newLoginPhone)){
                            $cordovaToast.showShortBottom("请输入正确得手机号码");
                            e.preventDefault();
                        }else if($scope.loginPhone == $scope.data.newLoginPhone){
                            $cordovaToast.showShortBottom("手机号码未修改");
                            e.preventDefault();
                        }else{
                            return $scope.data.newLoginPhone;
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            $scope.loginPhone = $scope.data.newLoginPhone;
        });
    };

    //ordercontent.html取消按钮
    $scope.btnCancel = function(){
        $state.go("ordercompletion");
    };

}

//发送短信
function getVerifyCode($scope,$interval,$timeout,$http,phone){

    $http.post(http_doorcollectSendsms,{},{params:{"phone":phone}}).
        success(function(data) {
            if(data.status == "SUCCESS"){
                $scope.localCode = data.data["code"];
            }
        });

    $scope.isDisabled = true;

    var countdown = 10;

    var myTime = $interval(function() {

        countdown--;
        $scope.buttonValue= countdown+"秒后重新获取";

    }, 1000);
    $timeout(function(){

        $scope.isDisabled = false;
        $interval.cancel(myTime);
        $scope.buttonValue = 0;

    }, 10000);

}

//订单提交
function sendOrderMsg($http,$state,shopCarFactory,$cordovaToast) {

    var shoppingCar = shopCarFactory.getShoppingCar();
    var address = shoppingCar.address;
    var payMethod = shoppingCar.payMethod;
    var details = shoppingCar.shareDetails;

    if ("" != details && undefined != details && 0 != details.length && "" != payMethod
        && undefined != payMethod && undefined != address && "" != address) {

        var orderInfo = {};
        orderInfo.contact = address;
        orderInfo.customerKey = window.localStorage.getItem("key");
        orderInfo.city = address.city;
        orderInfo.details = shoppingCar.shareDetails;
        orderInfo.totalPrice = Number(shoppingCar.totalPrice);

        orderInfo.discount = shoppingCar.discount;
        if ("" != shoppingCar.discount && undefined != shoppingCar.discount && 0 != shoppingCar.discount
            && ("" == shoppingCar.discount.gifts || undefined == shoppingCar.discount.gifts)) {
            orderInfo.discountProd = shoppingCar.discount.details[0];
        }
        orderInfo.progress = 'UNARRANGE';

        $http.post(http_doorcollectAddTempOrderC, orderInfo).success(function (responseData) {
            if (responseData.status == "SUCCESS") {
                var orderId = responseData.data.orderId;
                if(undefined != orderId && "" != orderId){
                    var uuidKey = window.localStorage.getItem("key");
                    if(uuidKey.indexOf("uuid") == 0){
                        $state.go("ordercontent");
                    }else{
                        $state.go("ordercompletion");
                    }

                }else{
                    $cordovaToast.showShortBottom(responseData.data);
                }
            }else {
                $cordovaToast.showShortBottom(responseData.data);
            }
        });
    }
}


