/**
 * Created by lining on 15/6/11.
 */


starter.controller("changeAddress",['$scope','$http','$ionicPopup','$stateParams',function ($scope,$http,$ionicPopup,$stateParams){
    //加载页面后默认为当前日期
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentDateStr = '';
    if (month < 10) {
        if (day < 10) {
            currentDateStr = year + '-0' + month + '-0' + day;
        } else {
            currentDateStr = year + '-0' + month + '-' + day;
        }

    } else {
        if (day < 10) {
            currentDateStr = year + '-0' + month + '-0' + day;
        } else {
            currentDateStr = year + '-0' + month + '-' + day;
        }
    }
    document.getElementById("validDate").value=currentDateStr;




    //如何获取当前登录用户    9c4e4615e8a50c48
    $http.get("http://192.168.1.10:8080/kangnuo/customer/getAddressList?key="+getStorage("key")).success(function(response){
        var address = new Array();
        angular.forEach(response.data,function(data,index,array){
            if(data.isDefault==true){
                $scope.defaultAddress = data;
            }else{
                address.push(data);
            }

        });
        $scope.address = address;
    });

    //选中地址
    var selected ;

    //确定更换地址
    $scope.changeAddress = function(){
        var validDate = document.getElementById("validDate").value;
        if(selected == null){
            var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: '请选择地址!'
            });
            return;
        }
        if(!checkDate()){
           return;
        }
        var postData = {
            "orderId":$stateParams.orderId,
            "userId":getStorage("key"),
            "userName":getStorage("loginName"),
            "validDate":validDate,
            "contact":selected

        }

        /*var postDataTest = {
            "orderId":"ay00009",
            "validDate":"2015-08-09",
            "contact":{
                "name": "李宁",
                "phone": "13621241902",
                "city": "北京市",
                "district": "丰台区",
                "address": "马家堡东路怡然家园",
                "location":
                {"lat":114.581021,"lng":36.642005}
            }
        }*/

        $http.post("http://192.168.1.10:8080/kangnuo/order/transfer",postData).success(function(response){

        }).success(function (data) {
            var template = "";
            if (data.status == 'SUCCESS') {
                template = "更换成功!"
            } else if (data.status == 'ERROR') {
                template = '操作失败，请重新提交!'
            }
            else if (data.status == 'INVALID') {
                template = '该订单无效!'
            }
            else if (data.status == 'TIMEERROR') {
                template = '生效时间有误，请重新填写!'
            }
            var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: template
            });
        }).error(function () {
            var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: "网络异常，请检查网络后重试"
            });
        })
    }

    //获取选中的值，赋给变量
    $scope.getSelectedValue = function(val){
        selected = val;
    }

    function checkDate(){
        var validDate = document.getElementById("validDate").value;
        if(validDate!=""){
            var validDateArr = validDate.split("-");
            var currentDateArr = currentDateStr.split("-");
            //选择的时间
            var selectDate = new Date(parseInt(validDateArr[0]),parseInt(validDateArr[1])-1,parseInt(validDateArr[2]),0,0,0);
            //当前时间
            var currentDate = new Date(parseInt(currentDateArr[0]),parseInt(currentDateArr[1])-1,parseInt(currentDateArr[2]),0,0,0);
            if(selectDate.getTime() <= currentDate.getTime()) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示信息',
                    template: '生效日期要大于今天!'
                });
                return false;
            }else if(selectDate.getTime() > currentDate.getTime()){
                var afterDayStr = getAfterDay();
                var afterDayArr = afterDayStr.split("-");
                var afterDay = new Date(parseInt(afterDayArr[0]),parseInt(afterDayArr[1])-1,parseInt(afterDayArr[2]),0,0,0);
                var compareDate = new Date(parseInt(currentDateArr[0]),parseInt(currentDateArr[1])-1,parseInt(currentDateArr[2]),"09","00","00");
                var nowDate = new Date();
                //九点前换地址
                if(nowDate.getTime() < compareDate.getTime()){
                    return true;
                //九点后换地址
                }else if(nowDate.getTime() > compareDate.getTime()){
                    if(selectDate.getTime() >= afterDay.getTime()){
                        return true;
                    }else{
                        var alertPopup = $ionicPopup.alert({
                            title: '提示信息',
                            template: '9点后换地址生效日期要选择明天以后的日期!'
                        });
                        return false;
                    }
                }
            }
        }else{
            var alertPopup = $ionicPopup.alert({
                title: '提示信息',
                template: '请选择生效日期!'
            });
        }
    }
    //获取后天的日期
    function getAfterDay(){
        var nowDate = new Date();
        nowDate.setDate(nowDate.getDate()+2);
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth()+1;
        var day = nowDate.getDate();
        return year+"-"+month+"-"+day;
    }
}]);



