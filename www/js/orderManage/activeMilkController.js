
starter.controller('activeMilk',['$scope','$ionicPopup','$http','$location','$stateParams',confirms]);
function confirms($scope,$ionicPopup,$http,$location,$stateParams) {

        /*
         * 满足启奶条件的返回奶品名称
         */
        var canStartMilkList = function (orderId) {

            var url = http_getActives;
            $http.post(url, {
                "orderId": orderId,
            }).success(function (data) {
                if (data.status == 'SUCCESS') {
                    $scope.productList = data.data[0].detail;
                    if($scope.productList.length==0){
                        alert("没有可以操作的数据")
                    }
                }
            }).error(function (data) {
                console.log('请求出错！')
            })
        };
    console.log("接收的orderId======"+$stateParams.orderId)
        canStartMilkList($stateParams.orderId);
        //canStartMilkList("ay00004-150709");

    var activeMilk = [];
    $scope.addActiveMilks = function(product) {
        var idx = activeMilk.indexOf(product);
        if (idx > -1) {
            activeMilk.splice(idx, 1);
        }
        else {
            activeMilk.push(product);
        }
        console.log(activeMilk.length);
        console.log(activeMilk);
    };




        /*
         * 修改订单完成后提交数据
         */
        $scope.startDelivery = function () {
            $scope.falg = false;
            var submitArray = new Array();
            if(activeMilk.length==0){
                $scope.falg = false;
                $scope.des = '请选择要开始配送的奶品!';

            }
            for (var i = 0; i < activeMilk.length; i++) {
                $scope.falg = true;
                var changeDate = document.getElementById('model_' + i).value;
                if(changeDate==null||changeDate==""){
                    $scope.falg = false;
                    $scope.des = '开始配送时间日期不能为空!';
                    break
                }
                var nextDate = new Date(getNowFormatDate()+" 18:00:00");//当前日期的18:00:00
                console.log("当前日期的18:00:00"+nextDate);
                var nowDate = new Date() ;//当前日期和时间
                console.log("当前日期和时间"+nowDate)
                var nowDatas = new Date(getNowFormatDate());//当前日期
                console.log("当前日期"+nowDatas);
                var indNowDate = new Date(changeDate);//用户输入的日期
                console.log("用户输入的日期"+indNowDate)
                if(nowDate<nextDate){//当前时间小于18点, 用户可以选择第二天配送
                   if(((indNowDate-nowDatas)/60/60/24/1000)<1){
                       $scope.falg = false;
                       $scope.des = '开始配送时间日期要在明天之后!';
                       break
                   }

                }else{
                    if(((indNowDate-nowDatas)/60/60/24/1000)<2){
                        $scope.falg = false;
                        $scope.des = '开始配送时间日期要在后天之后!';
                        break
                    }
                }
                if(activeMilk[i].beginDate!=null||activeMilk[i].beginDate!=""){
                    var beginDates = activeMilk[i].beginDate ;
                    var begin = new Date(beginDates)
                    if(((indNowDate-begin)/24/60/60/1000)>=0){
                        $scope.falg = false;
                        $scope.des = '开始配送时间日期不能大于已有的配送日期';
                        break
                    }
                }

                submitArray.push({"detailId": $scope.productList[i].detailId, "validDate": changeDate});
            }

            if($scope.falg){
                console.log({"orderId": $stateParams.orderId,"detail": submitArray,"userId":window.localStorage.getItem("key")})
                var url = http_actives;
                $http.post(url, {
                    "orderId": $stateParams.orderId,
                    "userId":window.localStorage.getItem("key"),
                    "userName":window.localStorage.getItem("loginName"),
                    "detail": submitArray
                }).success(function (data) {
                    console.log(data);
                    $location.path('/orderList')
                })
                //$location.path('/orderList');
            }
        };

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
}