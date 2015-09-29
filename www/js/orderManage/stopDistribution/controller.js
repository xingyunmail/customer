/**
 * Created by zh on 15/7/6.
 */


starter.controller('stopDistributionController', ['$scope', '$location', '$http', '$state','stopDistributionFactory', getInfo]);

function getInfo($scope, $location, $http, $state,stopDistributionFactory){
    var orderList = stopDistributionFactory.getOrderList();
    for(var i=0;i<orderList.detail.length;i++){
        orderList.detail[i].stopDate =  new Date(orderList.detail[i].stopDate);
        orderList.detail[i].beginDate =  ""
    }
    $scope.details = orderList.detail;

    $scope.stopOpertion = function(obj){
        //var param = {"orderId":"ay00002", "detail":[{"stopDeliverDate": "2015-06-26", "nextDeliverDate": "",
        //    "prodId":"1003", "deliverRules":"EVERDAY","prodType": "BYORDER" }] }

        var orderId = orderList.orderId;

        var result = new Array();
        var isub = new Array();
        for(var i=0;i<obj.length;i++){
            result.push(
                {"stopDeliverDate": new Date(obj[i].stopDate).Format("yyyy-MM-dd"),"nextDeliverDate":new Date(obj[i].beginDate).Format("yyyy-MM-dd"),
                "prodId":obj[i].prodId, "deliverRules": obj[i].deliverRules, "prodType": obj[i].prodType}
                        );
            console.log(obj[i].prodId+"暂停配送ID："+result[i].prodId);
             isub.push($scope.checkStopDate(i));//验证页面提交时间是否符合
            }
        var isub_submit = contains(isub,false);
        if(!isub_submit){
           updateStopDistribution(orderId, result, $location, $http);
        }else{
            $scope.des = '暂停配送时间不正确';
        }
    }

    /**
     * 验证日期// 当前日期 9点之后不能暂停 明天的配送，9点之前的可以
     */
    $scope.checkStopDate = function(index){
        $scope.falg = true;
        var stopTime = new Date($scope.details[index].stopDate);
        var nextDate = new Date(getNowFormatDate()+" 09:00:00");//当前日期的上午09:00:00
        //console.log("当前日期的上午09:00:00"+nextDate);
        var nowDate = new Date() ;//当前日期和时间
        //console.log("当前日期和时间"+nowDate)
        var nowDatas = new Date(getNowFormatDate());//当前日期
        //console.log("当前日期"+nowDatas);
        var indNowDate = new Date(stopTime);//用户输入的日期
        //console.log("用户输入的日期"+indNowDate)
        if(nowDate<nextDate){//当前时间小于上午9点, 用户可以选择第二天配送
            if(((indNowDate-nowDatas)/60/60/24/1000)<1){
                $scope.falg = false;
                $scope.des = '暂停配送时间日期要在明天之后!';
            }else{
                $scope.falg = true;
                $scope.des = '';
            }
        }else{
            if(((indNowDate-nowDatas)/60/60/24/1000)<2){
                $scope.falg = false;
                $scope.des = '暂停配送时间日期要在后天之后!';
            }else{
                $scope.falg = true;
                $scope.des = '';
            }
        }
        return $scope.falg;
    }
    //下次开始时间要大于等于暂停配送时间
    $scope.checkStartStop = function(index){
        var startDate = new Date($scope.details[index].beginDate);
        var stopDate = new Date(document.getElementById("end"+index).value);
        console.log(stopDate);
        console.log(stopDate+"--------------------"+(startDate<stopDate));
        if(startDate < stopDate){
            $scope.des = '下次配送时间要大于等于暂停配送时间!';
        }else{
            $scope.des = '';
        }
    }
}

//修改暂停配送时间
function updateStopDistribution(orderId,params,$location,$http){
    $http.post("http://192.168.1.32:8080/knPlatform2/order/stop",{orderId:orderId,detail:params}).
        success(function(json, status, headers, config) {
            if(json.status == "SUCCESS"){
                console.log("更新成功！");
                alert("更新成功！");
                //$location.path("/address");
            }
        }).
        error(function(json, status, headers, config) {
            console.log("暂停配送失败！"+json);
        });
}
//获取当前时间并转换为YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//判断值 是否存在数组内
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

