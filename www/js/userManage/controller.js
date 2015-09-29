/**
 * Created by xiaowu on 15/6/19.
 */
starter.controller('userManageCtrl', function ($ionicLoading,$rootScope, $scope, $location, $interval, $timeout, $http, $ionicPopup) {
    var key = window.localStorage.getItem("key")
    var localuserName = window.localStorage.getItem("loginName")
//    判断是否登陆
    judgeLoad()
//    弹出修改框
//        $scope.showPopup = function() {
//            $scope.data = {}
//
//            // An elaborate, custom popup
//            var myPopup = $ionicPopup.show({
//                template: '<input type="text" ng-model="data.wifi">',
//                title: '手机号修改',
//                scope: $scope,
//                buttons: [
//                    { text: '取消' },
//                    {
//                        text: '<b>确定</b>',
//                        type: 'button-positive',
//                        onTap: function(e) {
//                            if (!$scope.data.wifi) {
//
//                                e.preventDefault();
//                            } else {
//
//                                $scope.phoneValue=$scope.data.wifi;
//                             alert($scope.phoneValue)
//                                return $scope.data.wifi;
//                            }
//                        }
//                    }
//                ]
//            });
//            myPopup.then(function(res) {
//                console.log('Tapped!', res);
//            });
//
//        };
//    获取验证码
    $scope.getVerifyCode = function () {

        var phoneValue = $scope.phoneValue;
        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!phoneReg.test(phoneValue)) {
            showError($ionicLoading, '请输入正确的手机号');
        } else {
            $http.post(requestUrl + 'customer/check', {}, {params: {"loginName": phoneValue}})

                .success(function (data) {
                    console.log(data)
                    if (data.status == "SUCCESS") {
                        //获取验证码

                        $http.post(requestUrl + 'code/sendsms', {}, {params: {"phone": phoneValue}})

                            .success(function (data) {

                                if (data.status == "SUCCESS") {
                                    $scope.getCode = data.data["code"];
                                }
                            })
                        $scope.isDisabled = true;

                        var countdown = 30;

                        var myTime = $interval(function () {

                            countdown--;
                            $scope.buttonValue = countdown + "秒后重发";

                        }, 1000);
                        $timeout(function () {

                            $scope.isDisabled = false;
                            $interval.cancel(myTime);
                            $scope.buttonValue = 0;

                        }, 30000);

                    } else {

                        showError($ionicLoading,'该手机已被注册');


                    }
                })
                .error(function (data) {
                    showError($ionicLoading,'网络异常,请检查网络~');

                });


        }
    };

//   注册判断
    $scope.registerVerify = function () {


        var password = $scope.password;
        var repassword = $scope.repassword;
        var getcode = $scope.getCode;
        var localcode = $scope.localCode;


        if (password == undefined || password == "") {
            showError($ionicLoading, '请输入密码');
        } else if (password.length < 6 || password.length > 12) {
            showError($ionicLoading, '请输入6-12位的密码');
        } else if (password != repassword) {
            showError($ionicLoading, '两次密码不同');
        } else if (getcode != localcode || localcode == undefined || localcode == "") {
            showError($ionicLoading, '验证码错误');

        } else {

            register($scope, $http);

        }

    };


//    注册函数
    function register($scope, $http) {
        var  key=window.localStorage.getItem('key');
//        var key='uuidd062a7d64a1749fd';
        showMessage($ionicLoading);
//        $http.post(requestUrl + 'customer/register', {}, {params: {"loginName": $scope.phoneValue, "password": $scope.password}})
        $http.post(requestUrl + 'tempcust/tmpTocust', {}, {params: {"loginName": $scope.phoneValue, "password": $scope.password,"key":key}})
            .success(function (data) {
                showHidden($ionicLoading);
                console.log(data);
                if (data.status == "SUCCESS") {
                    $scope.msg = "";
                    window.localStorage.setItem("loginName", data.data.loginName);
                    window.localStorage.setItem("key", data.data.key);
                    alert(data.status);

//                    $location.path("/showResult");
                    $rootScope.registerShow=true;
                } else {
//                    $scope.msg = "注册失败,请重新注册";
                    showError($ionicLoading, '注册失败,请重新注册');

                }
            })
            .error(function (data) {
                showHidden($ionicLoading);
                showError($ionicLoading, '登陆失败,请检查网络连接');

            });


    }

//    判断是否已经登陆
    function judgeLoad() {
       var loc;
       if(localuserName) {
           var tempStr = localuserName.toLowerCase();
           loc = tempStr.indexOf('l');
       }
        if (loc != -1) {
            //显示注册界面
            $scope.registerhide = false;
            $scope.posswordhide = true;

        } else {
            $scope.registerhide = true;
            $scope.posswordhide = false;
            $scope.localphone = localuserName;

        }

    }
    $scope.opinionhide=function(){
        $rootScope.opinions=false;
    }
    $scope.registerHideClick=function(){
        $rootScope.registerShow=false;
    }
    $scope.goonshopping=function()
    {
        $rootScope.opinions=false;
        $location.path("/homePage")
    }
    $scope.goshopping=function()
    {
        $rootScope.registerShow=false;
        $location.path("/homePage")
    }

//修改密码
    $scope.modpassword = function () {
        var password = $scope.oldpassword;
        var newpassword = $scope.newpassword;
        var renewpassword = $scope.renewpassword;

//           alert(requestUrl)

        if (password == undefined || password == "") {
            showError($ionicLoading, '请输入原密码');
        } else if (newpassword == undefined || newpassword == "" || newpassword.length < 6 || newpassword.length > 12) {
            showError($ionicLoading, '请输入6-12位的新密码');

        } else if (newpassword != renewpassword) {
            showError($ionicLoading, '两次密码不同');

        } else if (newpassword == password) {
            showError($ionicLoading, '原密码和新密码不能一样');

        } else {
            showMessage($ionicLoading);
            $http.post(requestUrl + 'customer/checkOldPsw', {}, {params: {"password": $scope.oldpassword, "key": key}})

                .success(function (data) {
                    console.log(data);
                    if (data.status == "SUCCESS") {

                        $scope.newmsg = "";

                        $http.post(requestUrl + 'customer/updatePsw', {}, {params: {"password": newpassword, "key": key}})
                            .success(function (data) {
                                showHidden($ionicLoading);
                                console.log(data);
                                if (data.status == "SUCCESS") {
                                    $rootScope.opinions=true;
                                } else {

                                    showError($ionicLoading, '注册失败');
                                }

                            })
                            .error(function (data) {
                                showHidden($ionicLoading);
                                showError($ionicLoading, '登陆失败,请检查网络连接');

                            });

                    } else {
                        showHidden($ionicLoading);
                        showError($ionicLoading, '原密码错误');

                    }
                })


        }
    }


});

