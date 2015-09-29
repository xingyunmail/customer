/**
 * Created by xianChaoFan on 15/7/23.
 */


starter.controller('buySoonCtrl', ['$scope', '$http', '$state', 'buySoonFactory', 'shopCarFactory', buySoonInfo]);

var model;
var totalDays = '';
var quantity = '';

var beginDate = '';
//var selActivity;
//var activityObj = [];

function buySoonInfo($scope, $http, $state, buySoonFactory, shopCarFactory) {

    scrollToTop();

    model = buySoonFactory.getDetails();
    $scope.model = model;


    getActivityName($http, $scope);
    // -----------------------default--------------------
    $scope.buy_beginDate = afterTomarrow;// -----默认开始时间----
    $scope.buy_deliverRule = 'EVERDAY';
    $scope.month = 3;
    // -----------------------default--------------------
    $scope.$watch('buy_quantity', function () {
        console.log($scope.buy_quantity);
        updateBuyDatas($scope, $http);
    });

    $scope.setDeliverRule = function () {
        console.log('buy_deliverRule---------' + $scope.buy_deliverRule);
        updateBuyDatas($scope, $http);
    }

    $scope.setMonth = function () {
        console.log('month---------' + $scope.month);
        updateBuyDatas($scope, $http);
    }

    $scope.$watch('buy_beginDate', function () {
        console.log('buy_beginDate---------' + $scope.buy_beginDate);
        getBuyEndDate($scope);
    })

    $scope.changeEndDate = function () {
        console.log('buy_endDate---------' + $scope.buy_endDate);
        var dayDistance = compareTwoDays(getEspeTyleDate($scope.buy_endDate), getEspeTyleDate($scope.buy_beginDate));
        if (dayDistance < 0) {
            alert('结束时间不能小于开始时间!');
            return;
        }
        getProductPrice($scope);
        // 获取优惠信息
        getActivityInfo($http, $scope);
    }

//    $scope.needMilkBox = function () {
//        console.log(document.getElementsByName('milkBox')[0].checked);
//        if (document.getElementsByName('milkBox')[0].checked == true) {
//            $scope.totalPrice = $scope.totalPrice + 10;
//        } else {
//            $scope.totalPrice = $scope.totalPrice - 10;
//        }
//    }

    //====================点击确定======================
    $scope.gotoConfirmOrder = function () {
        var details = new Array();
        var milk = new Object();
        var product = new Object();

        milk.beginDate = $scope.buy_beginDate;
        milk.deliverDays = totalDays;
        milk.deliverRules = $scope.buy_deliverRule;
        milk.endDate = $scope.buy_endDate;
        milk.image = model.icon;
        milk.price = model.price;
        milk.prodId = model.prodId;
        milk.prodName = model.prodName;
        milk.prodType = "BYORDER";
        milk.prodUnit = model.unit;
        milk.quantity = $scope.buy_quantity;
        milk.city = model.city;

        details.push(milk);
        console.log(details);
        shopCarFactory.setDetails(details);

        var selActivity = JSON.parse($scope.activityInfo);
        console.log(selActivity);

        if (selActivity == undefined || selActivity == 0) {
            console.log('-----------没有选赠品----------');
            discount = 0;
        } else {
            console.log('-----------选了赠品----------');

            if (selActivity.products) {// 商品

                var products = new Array();
                for (var i = 0; i < $scope.selectedActi.length; i++) {
                    var actiObj = $scope.selectedActi[i];

                    product.beginDate = actiObj.acti_beginDate;
                    product.quantity = actiObj.quantity / Number(actiObj.acti_quantity);
                    product.deliverRules = actiObj.acti_deliverRule;
                    product.endDate = actiObj.acti_endDate;
                    product.price = actiObj.price;
                    product.prodId = actiObj.prodId;
                    product.prodName = actiObj.name;
                    product.prodType = "BYORDER";
                    product.prodUnit = actiObj.unit;
                    product.image = actiObj.icon;
                    product.totalQuantity = actiObj.quantity;

                    products.push(product);
                }
                selActivity.details = products;
            }
        }

        console.log(selActivity);
        shopCarFactory.setDiscount(selActivity);

        console.log('totalPrice---------' + $scope.totalPrice);
        shopCarFactory.setPrice($scope.totalPrice);


        $state.go("confirmOrder");
    }

// =====================赠品=========================
    $scope.myActivity = false;
    $scope.activitySendInfo = false;

    $scope.selectActivityType = function () {

        console.log('-------选择活动类型--------');

        var selActivity = JSON.parse($scope.activityInfo);// json字符串 转 json对象
        console.log(selActivity);

        if (selActivity.products) {// 商品
            console.log('-----商品-----');
            // ---------------------default------------------------
            var activityObj = selActivity.products;
            console.log(activityObj);
            $scope.selectedActi = activityObj;

            $scope.myActivity = true;
            $scope.activitySendInfo = true;
            $scope.acti_products = true;
            $scope.acti_gifts = false;

            for (var i = 0; i < $scope.selectedActi.length; i++) {
                var actiProduct = $scope.selectedActi[i];
                actiProduct.acti_quantity = 1;
                actiProduct.acti_deliverRule = 'EVERDAY';
                actiProduct.acti_beginDate = afterTomarrow;
            }

            $scope.$watch('selectedActi', function () {
                getActiEndDay($scope);
            }, true);

        } else { // 实物
            console.log('-----实物-----');

            var activityObj = selActivity.gifts;
            console.log(activityObj);
            $scope.selectedActi = activityObj;

            $scope.myActivity = true;
            $scope.activitySendInfo = false;
            $scope.acti_products = false;
            $scope.acti_gifts = true;
        }

    }


}

function getActiEndDay($scope) {
    console.log('-------------计算结束时间-----------');

    for (var i = 0; i < $scope.selectedActi.length; i++) {
        var actiProduct = $scope.selectedActi[i];

        if (actiProduct.quantity == 0) {
            actiProduct.acti_beginDate = '';
            actiProduct.acti_endDate = '';
            return;
        }

        var actiTotalDays = actiProduct.quantity / Number(actiProduct.acti_quantity);
        actiTotalDays = Math.round(actiTotalDays);
        console.log('actiTotalDays----------' + actiTotalDays);
        console.log('acti_deliverRule----------' + actiProduct.acti_deliverRule);
        console.log('acti_beginDate----------' + actiProduct.acti_beginDate);
        actiProduct.acti_endDate = getEndDate(actiProduct.acti_deliverRule, actiTotalDays, actiProduct.acti_beginDate);
    }
}

function updateBuyDatas($scope, $http) {

    getBuyEndDate($scope);
    getProductPrice($scope);
    getActivityInfo($http, $scope);
}

// 由开始时间得到结束时间
function getBuyEndDate($scope) {
    beginDate = new Date($scope.buy_beginDate);
    $scope.buy_endDate = new Date(beginDate.setMonth(beginDate.getMonth() + Number($scope.month), beginDate.getDate()));
}

//计算总价
function getProductPrice($scope) {
    totalDays = getDeliverDays($scope.buy_beginDate, $scope.buy_endDate, $scope.buy_deliverRule);
    $scope.totalPrice = totalDays * $scope.buy_quantity * model.price;
}

function getActivityName($http, $scope) {

    console.log('----获取优惠活动----名称-------');
    console.log('city---------' + model.city);
//    $scope.allActiName = ["满1000", "满2000", "满3000", "满4000"];

//    var requestHost =  + model.city;
//    var requestHost = "http://192.168.1.32:8080/knPlatform2/activity/getProductDiscount";
    $http.post(http_buySoonGetActiName, {},{params:{"company": model.city}})
        .success(function (data) {
            if (data.status == "SUCCESS") {
                console.log('---获取优惠活动--名称--成功---');
                console.log(data.data);
                $scope.allActiName = data.data;
//                document.getElementById('acticityName_ul').style.height = $scope.allActiName.length * 30 + 'px';
            }
        })
        .error(function (data) {
            console.log('获取优惠活动名称失败');
        });
}

// 获得优惠活动详细信息
function getActivityInfo($http, $scope) {

    // 之前的活动查询和选择清零
    $scope.activityInfos = '';
    $scope.activityInfo = 0;
    $scope.selectedActi = '';

    console.log('---获取优惠活动信息---');
    console.log('quantity-----' + $scope.buy_quantity);
    console.log('totalDays-----' + totalDays);
    console.log(model);

//    var requestHost = "http://test.kangnuo.com/activity/getProductDiscount";
//    var requestHost = "http://192.168.1.32:8080/knPlatform2/activity/getProductDiscount";
    $http.post(http_buySoonGetActi,
        {"company": model.city,
            "detail": [
                {
                    "quantity": $scope.buy_quantity,
                    "deliverDays": totalDays,
                    "prodId": model.prodId,
                    "price": model.price
                }
            ]})
        .success(function (data) {
            if (data.status == "SUCCESS") {
                console.log('---获取优惠活动--信息--成功---');
                console.log(data.data);
                $scope.activityInfos = data.data;
                console.log('赠品数量-----' + $scope.activityInfos.length);
            }
        })
        .error(function (data) {
            console.log('获取优惠活动信息失败');
        });
}

function showPopup4($ionicPopup, $scope) {

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
        scope: $scope,

        title: '请先设置开始时间！',
        buttons: [
            {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function (e) {
                }
            }
        ]
    });

    myPopup.then(function (res) {
        console.log('Tapped!', res);
    });
};

//function scrollToTop() {
//    var tn=0;
//    var tli=document.getElementById("hui").getElementsByTagName("ul");
//    rollText_tt=setInterval("rollText(tn)",100);
//    function rollText(n){
//        clearInterval(rollText_tt);
//        tn++;
//        if (tn>=tli.length){tn=0;}
//        rollText_tt=setInterval("rollText(tn)",2000);
//        for (var j=0; j<tli.length; j++){
//            tli[j].style.display=j==n?"block":"none";
//        }
//    }
//}

function scrollToTop () {
    function $(element){
        if(arguments.length>1){
            for(var i=0,length=arguments.length,elements=[];i<length;i++){
                elements.push($(arguments[i]));
            }
            return elements;
        }
        if(typeof element=="string"){
            return document.getElementById(element);
        }else{
            return element;
        }
    }
    var Class={
        create:function(){
            return function(){
                this.initialize.apply(this,arguments);
            }
        }
    }
    Function.prototype.bind=function(object){
        var method=this;
        return function(){
            method.apply(object,arguments);
        }
    }
    var Scroll=Class.create();
    Scroll.prototype={
        initialize:function(element,height){
            this.element=$(element);
            this.element.innerHTML+=this.element.innerHTML;
            this.height=height;
            this.maxHeight=this.element.scrollHeight/2;
            this.counter=0;
            this.scroll();
            this.timer="";
            this.element.onmouseover=this.stop.bind(this);
            this.element.onmouseout=function(){this.timer=setTimeout(this.scroll.bind(this),1000);}.bind(this);
        },
        scroll:function(){
            if(this.element.scrollTop<this.maxHeight){
                this.element.scrollTop++;
                this.counter++;
            }else{
                this.element.scrollTop=0;
                this.counter=0;
            }
            if(this.counter<this.height){
                this.timer=setTimeout(this.scroll.bind(this),22);
            }else{
                this.counter=0;
                this.timer=setTimeout(this.scroll.bind(this),2126);
            }
        },
        stop:function(){
            clearTimeout(this.timer);
        }
    }
    var myscroll=new Scroll("allActicity",26);
}


//function wordScroll() {
//
//    try{
//        var isStoped = false;
//        var oScroll = document.getElementById("scrollWrap");
//        with(oScroll){
//            noWrap = true;
//        }
//
//        oScroll.onmouseover = new Function('isStoped = true');
//        oScroll.onmouseout = new Function('isStoped = false');
//
//        var preTop = 0;
//        var curTop = 0;
//        var stopTime = 0;
//        var oScrollMsg = document.getElementById("scrollMsg");
//
//        oScroll.appendChild(oScrollMsg.cloneNode(true));
//        init_srolltext();
//
//    }catch(e){}
//
//    function init_srolltext(){
//        oScroll.scrollTop = 0;
//        setInterval('scrollUp()', 15);
//    }
//
//    function scrollUp(){
//        if(isStoped)
//            return;
//        curTop += 1;
//        if(curTop == 19){
//            stopTime += 1;
//            curTop -= 1;
//            if(stopTime == 180){
//                curTop = 0;
//                stopTime = 0;
//            }
//        }else{
//            preTop = oScroll.scrollTop;
//            oScroll.scrollTop += 1;
//            if(preTop == oScroll.scrollTop){
//                oScroll.scrollTop = 0;
//                oScroll.scrollTop += 1;
//            }
//        }
//    }
//
//}


//var activityInfos0 = $scope.activityInfos[0];
//console.log(activityInfos0.description);
//                $scope.activityInfo = activityInfos0.description;
//                console.log('默认选中第一个赠品');
//                if (data.data) {
//
//                    if (activityInfos0.products) {// 商品
//                        console.log('----------商品');
//
//                        activityObj = activityInfos0.products;
//                        $scope.seleActivity = activityObj;
//
//                        console.log(activityObj);
//                        $scope.myActivity = true;
//                        $scope.activitySendInfo = true;
//                        $scope.acti_products = true;
//                        $scope.acti_gifts = false;
//
//                        $scope.acti_deliverRule = 'EVERDAY';
//                        $scope.setActiDeliverRule = function (acti_deliverRule) {
//                            console.log('^^^^^^^^^^^^^^^^');
//                            console.log('model------------' + $scope.acti_deliverRule);
//                            console.log('acti_deliverRule------------' + acti_deliverRule);
//                        }
//
//                    } else { // 实物
//                        console.log('----------实物');
//
//                        activityObj = activityInfos0.gifts;
//
//                        console.log(activityObj);
//                        $scope.myActivity = true;
//                        $scope.activitySendInfo = false;
//                        $scope.acti_products = false;
//                        $scope.acti_gifts = true;
//                    }
//
//                } else {
//                    console.log('没有赠品！');
//                    $scope.myActivity = false;
//                    $scope.activitySendInfo = false;
//                }


//// 将日期格式转换为  YYYY-MM-dd
//function getWantedStyleDate(date) {
//    var seperator1 = "-";
////    var seperator2 = ":";
//    var year = date.getFullYear();
//    var month = date.getMonth() + 1;
//    var strDate = date.getDate();
//    if (month >= 1 && month <= 9) {
//        month = "0" + month;
//    }
//    if (strDate >= 0 && strDate <= 9) {
//        strDate = "0" + strDate;
//    }
////    var currentdate = year + seperator1 + month + seperator1 + strDate
////        + " " + date.getHours() + seperator2 + date.getMinutes()
////        + seperator2 + date.getSeconds();
//
//    var currentdate = year + seperator1 + month + seperator1 + strDate;
//    return currentdate;
//}

//function getWantedStyleDate2(date) {
//    var seperator1 = "-";
////    var seperator2 = ":";
//    var year = date.getFullYear();
//    var month = date.getMonth();
//    var strDate = date.getDate();
//    if (month >= 1 && month <= 9) {
//        month = "0" + month;
//    }
//    if (strDate >= 0 && strDate <= 9) {
//        strDate = "0" + strDate;
//    }
////    var currentdate = year + seperator1 + month + seperator1 + strDate
////        + " " + date.getHours() + seperator2 + date.getMinutes()
////        + seperator2 + date.getSeconds();
//
//    var currentdate = year + seperator1 + month + seperator1 + strDate;
//    return currentdate;
//}


//            $scope.acti_quantity = 1;

//            $scope.reduceActiQuantity = function () {
//                console.log('减少日配送量');
//                if ($scope.acti_quantity == 1) return;
//                $scope.acti_quantity = $scope.acti_quantity - 1;
//            }
//
//            $scope.$watch('acti_quantity', function () {
//                console.log($scope.acti_quantity);
//                getActiEndDay($scope);
//            });
//
//            $scope.addActiQuantity = function () {
//                console.log('增加日配送量');
//                console.log($scope.acti_quantity);
//                console.log(totalQuantity);
//
//                if ($scope.acti_quantity >= totalQuantity) return;
//                $scope.acti_quantity = $scope.acti_quantity + 1;
//            }