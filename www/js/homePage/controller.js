/**
 * Created by xianChaoFan on 15/6/16.
 */



starter.controller('milkStyleCtrl', ['$scope', '$http', '$state', '$location', 'buySoonFactory', '$ionicLoading', '$cordovaToast', '$ionicPopup', getMilkList]);

var selCity = '';
var milkInfos = [];

function getMilkList($scope, $http, $state, $location, buySoonFactory, $ionicLoading, $cordovaToast, $ionicPopup) {

    var key = window.localStorage.getItem("key");
//    console.log("key------------" + key);

    $scope.loginAndRegis = true;

    if (key) {
        if (key.indexOf("uuid") >= 0) {// key里面有uuid 没有登录
            $scope.loginAndRegis = true;
        } else {// key里面没有uuid 已登录
            $scope.loginAndRegis = false;
        }
    } else {
        $scope.loginAndRegis = true;
    }

    var city = window.localStorage.getItem("city");
    console.log('city------------' + city);

    if (selCity == '') {// 第一次进来的时候点安卓实体返回键调用
        document.addEventListener("backbutton", function eventBackButtonHome() {

            updateHomeDatas($scope, "邯郸", $http, $ionicLoading);

        }, false);
    }

    if (contains(getAllCitys(), city) == true) {
        updateHomeDatas($scope, city, $http, $ionicLoading);
    } else if (city == null) {
        showPopup2($ionicPopup, $scope, $http, $ionicLoading);
    } else {
        showPopup($ionicPopup, $scope, city, $http, $ionicLoading);
    }

    // 轮播器
    new SlideTrans("idContainer", "idSlider", 3, { Vertical: false }).Run();

    $scope.setCityLoc = function () {
        $scope.headRightList = false;

        console.log('-------设置城市--------');
        if ($scope.cityLoc == false) {
            $scope.cityLoc = true;
            return;
        }
        $scope.cityLoc = false;
    }

    $scope.setMyCity = function () {
        console.log('city---------' + $scope.citySelected);
        console.log('city1---------' + $scope.myLoc_city);

        $scope.cityLoc = false;
        $scope.myLoc_city = $scope.citySelected;
        console.log('city2---------' + $scope.myLoc_city);

        updateHomeDatas($scope, $scope.myLoc_city, $http, $ionicLoading)
    }

    //下拉刷新
    $scope.doRefresh = function () {
        updateHomeDatas($scope, window.localStorage.getItem("city"), $http, $ionicLoading)
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.headRightList = false;

    $scope.openHeadRightList = function () {
        $scope.cityLoc = false;

        if ($scope.headRightList == true) {
            $scope.headRightList = false;
            return;
        }

        $scope.headRightList = true;
    }

    $scope.closeHeadRightList = function () {
        if ($scope.headRightList == true) {
            $scope.headRightList = false;
            return;
        }
    }

    $scope.addShoppintcar = function (prod) {
        console.log('加入购物车');
        addBuyCar($scope, $http, prod, $ionicLoading);
    }

    $scope.setBuySoonInfo = function (milkInfo) {
        console.log('立即购买');
        console.log(milkInfo);
        milkInfo.city = selCity;
        buySoonFactory.setDetails(milkInfo);
        $state.go("buySoon");
    }

    $scope.gotoShoppingcar = function () {
        $location.path('/shoppingcar');
    }

    $scope.gotoProductdetail = function (product) {
        console.log("-----gotoProductdetail--------");
        product.city = $scope.myLoc_city;
        buySoonFactory.setDetails(product);
        $state.go("productdetail");
    }
}

function updateHomeDatas($scope, city, $http, $ionicLoading) {


    $scope.myLoc_city = city;
    $scope.cityLoc = false;
    $scope.citySelected = city;
    selCity = city;
    window.localStorage.setItem("city", city);

    getAdvertise($http, $scope, $ionicLoading);
    getHomeList($http, $scope, $ionicLoading);
    getShoppingCarCount($http, $scope, $ionicLoading);
}


// 比较两个日期的大小 日期格式为 YYYY-MM-dd
function compareTwoDays(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));
    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));
    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
}

function getAllCitys() {
    var arrM = new Array();
    arrM = document.getElementById("moreCity").children;
//    console.info(document.getElementById("moreCity"));
    var citys = new Array();
    for (var i = 0; i < arrM.length; i++) {
//        console.info(arrM[i].value);
        citys.push(arrM[i].value);
    }
//    console.log(citys);
    return citys;
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function formartList(milkList) {
    var milkList_2 = new Array();
    for (var i = 0; i < milkList.length; i = i + 2) {
        var temp = new Array();
        temp.push(milkList[i]);
        if (milkList[i + 1]) {
            temp.push(milkList[i + 1]);
        }
        milkList_2.push({prods: temp});
    }

    return milkList_2;
}

function showPopup($ionicPopup, $scope, myCity, $http, $ionicLoading) {

    var myPopup = $ionicPopup.show({
        scope: $scope,
        template: '<select class="item item-select row-no-padding text-center"  style="width: 80%; text-align: center" id="selectedCity" onchange="getSelValue();">' +
            '<option selected value="邯郸">邯郸</option>' +
            '<option value="安阳">安阳</option>' +
            '<option value="武安">武安</option>' +
            '<option value="邢台">邢台</option>' +
            '</select>',

        title: '小诺得知您所在的城市' + '"' + myCity + '"' + '暂未开通服务，请您在以下已经开通服务的城市中选择',
        buttons: [
            {
                text: '<b>确定</b>',
                type: 'button-energized',
                onTap: function (e) {
                    var city = getSelValue();
                    console.log('city----------' + city);
                    updateHomeDatas($scope, city, $http, $ionicLoading);
                }
            }

        ]
    });

    myPopup.then(function (res) {
        console.log('Tapped!', res);
    });
};

function showPopup2($ionicPopup, $scope, $http, $ionicLoading) {

    var myPopup = $ionicPopup.show({
        scope: $scope,
        template: '<select class="item item-select row-no-padding text-center"  style="width: 80%; text-align: center" id="selectedCity" onchange="getSelValue();">' +
            '<option selected value="邯郸">邯郸</option>' +
            '<option value="安阳">安阳</option>' +
            '<option value="武安">武安</option>' +
            '<option value="邢台">邢台</option>' +
            '</select>',

        title: '小诺现在无法知道您所在的城市，无法为您提供更合适的服务。请您在以下已经开通服务的城市中选择',
        buttons: [
            {
                text: '<b>确定</b>',
                type: 'button-energized',
                onTap: function (e) {
                    var city = getSelValue();
                    console.log('city----------' + city);
                    updateHomeDatas($scope, city, $http, $ionicLoading);
                }
            }

        ]
    });

    myPopup.then(function (res) {
        console.log('Tapped!', res);
    });
};


function getSelValue() {
    var objSel = document.getElementById("selectedCity");
    return objSel.value;
}


function getAdvertise($http, $scope, $ionicLoading) {
    console.log(selCity + '————————获取轮播广告数据');

//    showMessage($ionicLoading);
    $scope.milkAds = '';

    $http.post(http_homeAdv,
        {"city": selCity})
        .success(function (data) {
            if (data.status == "SUCCESS") {
//                showHidden($ionicLoading);
                console.log('获取轮播广告数据成功');
                var milkAdsArr = data.data;
                console.log(milkAdsArr);
                $scope.milkAds = milkAdsArr;

//                var newMilkAdsArr = [];
//                console.log('获取商品更详细信息');
//                for (var i = 0, len = milkAdsArr.length; i < len; i++) {
//                    var milk = milkAdsArr[i];
//                    getMoreProductInfo($http,$scope,i,milkAdsArr,newMilkAdsArr);
//                }
            }
        })
        .error(function (data) {
//            showHidden($ionicLoading);
            showError($ionicLoading, '获取轮播广告数据失败');
            console.log('获取轮播广告数据失败');
        });
}


function getHomeList($http, $scope, $ionicLoading) {
    console.log(selCity + '————————获取首页商品数据');

//    showMessage($ionicLoading);
    $scope.milkInfos = '';

    $http.post(http_homeList,
        {"city": selCity})
        .success(function (data) {
            if (data.status == "SUCCESS") {
//                showHidden($ionicLoading);
                console.log('----获取数据成功----');
                console.log(data.data);
                $scope.milkInfos = data.data;
            }
        })
        .error(function (data) {
//            showHidden($ionicLoading);
            showError($ionicLoading, '获取首页商品数据失败');
            console.log('获取数据失败');
        });
}

function getShoppingCarCount($http, $scope, $ionicLoading) {
    console.log(selCity + '-----------获取购物车数量');

    $scope.shoppingCarCount = '';
    $scope.home_shopCar_Badge_0 = true;
    $scope.home_shopCar_Badge = false;

    var key = window.localStorage.getItem("key");
    console.log('key----------' + key);

    $http.post(http_homeGetShopCount,
        {key: key, "city": selCity})
        .success(function (data) {
            if (data.status == "SUCCESS") {
                console.log('获取购物车数量成功');
                console.log(data.data);
                console.log(data.data[0].length);

                var length = data.data[0].length;

                if (length > 99) {
                    $scope.shoppingCarCount = '99+';
                } else {
                    $scope.shoppingCarCount = length;
                }

                console.log('shoppingCarCount---------' + $scope.shoppingCarCount);

                if ($scope.shoppingCarCount) {
                    $scope.home_shopCar_Badge_0 = false;
                    $scope.home_shopCar_Badge = true;
                } else {
                    console.log('购物车为空！');
                    $scope.home_shopCar_Badge_0 = true;
                    $scope.home_shopCar_Badge = false;
                }
            }
        })
        .error(function (data) {
            showError($ionicLoading, '获取购物车数量失败');
            console.log('获取购物车数量失败');
        });
}

function addBuyCar($scope, $http, prod, $ionicLoading) {
    console.log(selCity + '----------加入购物车');

    showMessage($ionicLoading, '加入购物车中...');
    var key = window.localStorage.getItem("key");
    console.log('key----------' + key);

    $http.post(http_homeAddBuyCar,
        {"key": key, "shoppingCar": [
            {"prodId": prod.prodId, "prodName": prod.name, "prodUnit": prod.unit, "quantity": prod.quantity, "price": prod.price,
                "beginDate": new Date(new Date().setDate(new Date().getDate() + 1)).Format("yyyy-MM-dd"),
                "endDate": new Date(new Date().setDate(new Date().getDate() + 1)).Format("yyyy-MM-dd"), "deliverRules": 'EVERDAY',
                "prodType": 'BYORDER', "image": prod.icon, "deliverDays": '', "isUnionSetting": true,
                "insertDate": new Date().Format("yyyy-MM-dd"), "city": selCity}
        ]})
        .success(function (data) {

            if (data.status == "SUCCESS") {
                console.log('加入购物车成功');
                showHidden($ionicLoading);
                showSuccess($ionicLoading, '加入购物车成功');
                getShoppingCarCount($http, $scope, $ionicLoading);
            }
        })
        .error(function (data) {
            showHidden($ionicLoading);
            showError($ionicLoading, '加入购物车失败');
            console.log('加入购物车失败');
        });
}


//function getMoreProductInfo($http,$scope,i,milkAdsArr,newMilkAdsArr) {
//    var milk = milkAdsArr[i];
//    var prodId = milk.prodId;
//    var result = {products: [
//        {prodId: prodId}
//    ], city: selCity}
//    var getDetailURL = "http://192.168.1.10:8080/kangnuo/channel/queryProdByProdId";
//    $http.post(getDetailURL, result)
//        .success(function (json) {
//            if (json.status == "SUCCESS") {
//                console.log('--获取商品更详细信息成功--');
//                var data = json.data;
////                console.log(data);
//
//                milk.name = data.name;
//                milk.price = data.price;
//                milk.unit = data.unit;
////                console.log(milk);
//
////                console.log(i);
//                newMilkAdsArr.push(milk);
//
//                if (i == milkAdsArr.length - 1) {
//                    console.log('-----newMilkAdsArr-----');
//                    console.log(newMilkAdsArr);
//                    $scope.milkAds = newMilkAdsArr;
//                }
////
//            }
//        })
//        .error(function (json) {
//            console.log('查询商品详情失败');
//        });
//}


//function showPopup($ionicPopup, $scope, $http) {
//
//    // An elaborate, custom popup
//    var myPopup = $ionicPopup.show({
//        scope: $scope,
//        template: '<select class="item item-select row-no-padding text-center"  style="width: 80%; text-align: center" id="selectedCity" onchange="getSelValue();">' +
//            '<option selected value="邯郸">邯郸</option>' +
//            '<option value="安阳">安阳</option>' +
//            '<option value="武安">武安</option>' +
//            '<option value="邢台">邢台</option>' +
//            '</select>',
//
//        title: '小诺现在无法知道您所在的城市，无法为您提供更合适的服务。如果您的所在城市不是邯郸，请设置您所在的城市',
//        buttons: [
//            { text: '取消' },
//            {
//                text: '<b>确定</b>',
//                type: 'button-positive',
//                onTap: function (e) {
//                    console.log(getSelValue());
//                    $scope.city = getSelValue();
//                    selCity = $scope.city;
//                    getAdvertise($http, $scope, $ionicLoading);
//                    getHomeList($http, $scope, $ionicLoading);
//                }
//            }
//        ]
//    });
//
//    myPopup.then(function (res) {
//        console.log('Tapped!', res);
//    });
//};

//function showPopup2($ionicPopup, $scope, $http, selectCity, locaCity) {
//
//    console.log(selectCity);
//    console.log(locaCity);
//
//    // An elaborate, custom popup
//    var myPopup = $ionicPopup.show({
//        scope: $scope,
//        title: '小诺收到消息说您现在所在的城市不是' + selectCity + '，' + "是" + locaCity + '，' + "您要切换到" + selectCity + "么",
//        buttons: [
////            {
////                type: 'button-clear'
////            },
//            {
//                text: '<b>切换</b>',
//                type: 'button-positive',
//                onTap: function (e) {
//                    $scope.city = selectCity;
//                    selCity = $scope.city;
//                    getAdvertise($http, $scope, $ionicLoading);
//                    getHomeList($http, $scope, $ionicLoading);
//                }
//            }
////            {
////                type: 'button-clear'
////            }
//        ]
//    });
//
//    myPopup.then(function (res) {
//        console.log('Tapped!', res);
//    });
//};