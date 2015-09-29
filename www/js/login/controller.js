/**
 * Created by sunhao on 15/6/9.
 */



starter.controller('loginCtrl',['$rootScope','$ionicLoading','$scope','$location','$interval','$timeout','$http',loginAndRegiser]);
function loginAndRegiser($rootScope,$ionicLoading,$scope,$location,$interval,$timeout,$http) {
//     showSuccess($ionicLoading,"发送成功")
//     showError($ionicLoading,"发送失败")
//    showMessage($ionicLoading)

    //登陆
    $scope.login = function () {
        var userName = $scope.userName;
        var password = $scope.userPassword;
        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;

        if (!phoneReg.test(userName)) {
            showError($ionicLoading,"请输入正确的手机号")
        } else if (password == undefined || password == "" || password.length < 6 || password.length > 12) {
            showError($ionicLoading,"请输入6-12位的密码")

        } else {


            showMessage($ionicLoading);
            $http.post(requestUrl + 'customer/login', {}, {params: {"loginName": userName, "password": password}})
                .success(function (data) {
             showHidden($ionicLoading);
                    console.log(data)

                    if (data.status == "SUCCESS") {
                        window.localStorage.setItem("loginName",data.data.loginName);
                        window.localStorage.setItem("key",data.data.key);
                        showSuccess($ionicLoading," 登陆成功")
                        $location.path("/homePage");

                    } else {
                        showError($ionicLoading,"用户名或密码错误")
                    }
                })
                .error(function (data) {
                    showHidden($ionicLoading);
                    showError($ionicLoading,'网络异常,请检查网络~');

                });


        }

    };
    //注册界面--验证码按钮点击
    $scope.getauthcode = function () {
        //注册检查
        var phone = $scope.phone;
        var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!phoneReg.test(phone)) {
            showError($ionicLoading,'请输入正确的手机号');

        } else {

            $http.post(requestUrl + 'customer/check', {}, {params: {"loginName": $scope.phone}})

                .success(function (data) {
                    console.log(data)
                    if (data.status == "SUCCESS") {
                        getauthcode($scope, $interval, $timeout, $http, requestUrl);

                    } else {

                        showError($ionicLoading,'该手机已被注册');


                    }
                })
                .error(function (data) {
                    showError($ionicLoading,'网络异常,请检查网络~');

                });


        }

    }


//用户注册按钮点击
    $scope.registerClick = function () {

        var password = $scope.password;
        var repassword = $scope.repassword;
        var getcode = $scope.getCode;
        var localcode = $scope.localCode;

        if (password == undefined || password == "") {
            showError($ionicLoading,'请输入密码');

        } else if (password.length < 6 || password.length > 12) {
            showError($ionicLoading,'请输入6-12位的密码');

        } else if (password != repassword) {
            showError($ionicLoading,'两次密码不同');
        } else if (getcode != localcode || localcode == undefined || localcode == "") {
            showError($ionicLoading,'验证码错误');
        } else {


            register($ionicLoading,$scope, $http,$location, requestUrl);


        }

    };
}

//注册
function register($ionicLoading,$scope,$http,$location,requestUrl)
{

  showMessage($ionicLoading);
   var  key=window.localStorage.getItem('key')
//  $http.post(requestUrl+'customer/register',{},{params:{"loginName":$scope.phone,"password":$scope.password}})
    $http.post(requestUrl+'tempcust/tmpTocust',{},{params:{"loginName":$scope.phone,"password":$scope.password,"key":key}})

        .success(function(data) {
          showHidden($ionicLoading);
        if(data.status == "SUCCESS"){
            window.localStorage.setItem("loginName",data.data.loginName);
            window.localStorage.setItem("key",data.data.key);


            $location.path("/homePage");
            showSuccess($ionicLoading,'自动登录成功');
        }else
        {
            showError($ionicLoading,'注册失败,请重新注册');

        }
    })
      .error(function (data) {
          showHidden($ionicLoading)
          showError($ionicLoading,'网络异常,请检查网络~');

      });





}
//获取验证码
function getauthcode($scope,$interval,$timeout,$http,requestUrl){


    $http.post(requestUrl+'code/sendsms',{},{params:{"phone":$scope.phone}})

        .success(function(data) {
            if(data.status == "SUCCESS"){

                $scope.getCode = data.data["code"];



            }
        })
        .error(function (data) {
            showError($ionicLoading,'网络异常,请检查网络~');

        });


    $scope.isDisabled = true;

    var countdown = 30;

    var myTime = $interval(function() {

        countdown--;
        $scope.buttonValue= countdown+"秒后重发";

    }, 1000);
    $timeout(function(){

        $scope.isDisabled = false;
        $interval.cancel(myTime);
        $scope.buttonValue = 0;

    }, 30000);


}




