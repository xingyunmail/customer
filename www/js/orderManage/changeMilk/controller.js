/**
 * Created by xianChaoFan on 15/8/12.
 */

starter.controller('needChangeCtrl', ['$scope', '$location', 'exchangeFactory', '$ionicLoading',needChangeMilk]);

function needChangeMilk($scope, $location, exchangeFactory, $ionicLoading) {
    var milks = exchangeFactory.getMilks();
    console.log(milks);
    $scope.milks = milks;

    var needChangeMilks = [];
    $scope.addNeedChangeMilks = function(prod) {

        var idx = needChangeMilks.indexOf(prod);

        if (idx > -1) {
            needChangeMilks.splice(idx, 1);
        }
        else {
            needChangeMilks.push(prod);
        }
        console.log(needChangeMilks.length);
        console.log(needChangeMilks);
    };

    $scope.makeSureClick = function () {
        console.log('-------------needChangeMilks----------');
        console.log(needChangeMilks);
        exchangeFactory.setNeeds(needChangeMilks);
        $location.path("/exchangeMilk");
    }

    $scope.getRemainMilkCount = function (info) {
        return getRemainMilkCount(info);
    }

}


starter.controller('exchangeCtrl', ['$scope', '$http', '$location', 'exchangeFactory', exchangeMilk]);


function exchangeMilk($scope, $http, $location, exchangeFactory) {

    getMilks($http, $scope);

    var exchangeMilks = [];
    $scope.addExchangeProds = function (prod) {
        var idx = exchangeMilks.indexOf(prod);

        if (idx > -1) {
            exchangeMilks.splice(idx, 1);
        }
        else {
            exchangeMilks.push(prod);
        }
        console.log(exchangeMilks.length);
        console.log(exchangeMilks);

    };

    $scope.nextStep = function () {
        console.log('------------exchangeMilks---------');
        console.log(exchangeMilks);
        exchangeFactory.setProducts(exchangeMilks);
        $location.path("/exchangeConfirm");
    };

}

function formartList(milkList) {

    var milkList_2 = new Array();
    for (var i = 0; i < milkList.length; i = i + 3) {
        var temp = new Array();
        temp.push(milkList[i]);
        if (milkList[i + 1]) {
            temp.push(milkList[i + 1]);
        }

        if (milkList[i + 2]) {
            temp.push(milkList[i + 2]);
        }
        milkList_2.push({prods: temp});
    }

    return milkList_2;
}

function getMilks($http, $scope) {
    console.log('————————获取首页商品数据');

    $http.post(home_list,
        {"city": "邯郸"})
        .success(function (data) {
            if (data.status == "SUCCESS") {
                console.log('----获取数据成功----');
                console.log(data.data);
                $scope.products = formartList(data.data);
            }
        })
        .error(function (data) {
            console.log('获取数据失败');
        });
}


starter.controller('exConfirmCtrl', ['$scope', '$state', 'exchangeFactory', '$http','$ionicLoading',exchangeConfirm]);
var deliverDays = '';
var firstCome = 0;
var afterTomarrow = new Date(new Date().setDate(new Date().getDate() + 2));

function exchangeConfirm($scope, $state, exchangeFactory,$http, $ionicLoading) {

    $scope.needChange = exchangeFactory.getNeeds();

    $scope.uniteProducts = exchangeFactory.getProducts();

    for (var k = 0, klen = $scope.uniteProducts.length; k < klen; k++) {
        var uProduct = $scope.uniteProducts[k];
        uProduct.u_quantity = 1;

        $scope.$watch('uniteProducts', function () {
            console.log('-----------uniteProducts----------');
            console.log($scope.uniteProducts);
            findReplace($http, $scope, exchangeFactory);
        }, true);
    }

    var singleProducts = new Array();
    $scope.singleProducts = singleProducts;

    $scope.selectSingleSend = function (prod) {
//        singleProducts.push(prod);


        var idx0 = $scope.singleProducts.indexOf(prod);
        if (idx0 > -1) {
            $scope.singleProducts.splice(idx0, 1);
        }
        else {
            $scope.singleProducts.push(prod);
        }

        for (var j = 0, slen = $scope.singleProducts.length; j < slen; j++) {
            var productS = $scope.singleProducts[j];
            productS.s_quantity = 1;
            productS.s_deliverRule = 'EVERDAY';
            productS.s_Month = 1;
            productS.s_beginDate = afterTomarrow;

            $scope.$watch('singleProducts', function () {
                console.log('-------singleProducts----------');
                console.log($scope.singleProducts);
                updateSingleData($http, $scope, exchangeFactory);
            }, true);
        }

        console.log('-------singleProducts-----');
        console.log($scope.singleProducts);

        //-----------------------------------------
        var idx = $scope.uniteProducts.indexOf(prod);
        if (idx > -1) {
            $scope.uniteProducts.splice(idx, 1);
        }
        else {
            $scope.uniteProducts.push(prod);
        }
        console.log('-------uniteProducts-----');
        console.log($scope.uniteProducts);

    }


    // *********************unite*********************
    // --------------default------------------
    $scope.unite_deliverRule = 'EVERDAY';
    $scope.unite_Month = 1;
    $scope.unite_beginDate = afterTomarrow;
    setUniteEndDate($scope);
    // --------------default------------------

    $scope.updateUniteDeliverRule = function () {
        console.log('unite_deliverRule----------' + $scope.unite_deliverRule);
        findReplace($http, $scope, exchangeFactory);
    }

    $scope.updateUniteMonth = function () {
        console.log('unite_Month----------' + $scope.unite_Month);
        updateUniteData($http, $scope, exchangeFactory);

    }

    $scope.$watch('unite_beginDate', function () {
        console.log('changeUniteBeginDate---------' + $scope.unite_beginDate);
        var theDistance = compareTwoDays(getEspeTyleDate($scope.unite_beginDate), getEspeTyleDate(afterTomarrow));
        if (theDistance < 0) {
            alert('开始时间不能小于后天！');
            return;
        }
        setUniteEndDate($scope);
    })

    $scope.changeUniteEndDate = function () {
        console.log('changeUniteEndDate---------' + $scope.unite_endDate);
        $scope.unite_Month = 0;
        var dayDistance = compareTwoDays(getEspeTyleDate($scope.unite_endDate), getEspeTyleDate($scope.unite_beginDate));
        if (dayDistance < 0) {
            alert('结束时间不能小于开始时间!');
            return;
        }
        findReplace($http, $scope, exchangeFactory);
    }
    // *********************unite*********************

    //---------------------确认更换----------------------
    $scope.clickConfirmOrder = function () {
        console.log('----------点击确认更换---------')
        replace($http, $scope, exchangeFactory,$state, $ionicLoading);
    }
}

// ========================single============================
function updateSingleData($http, $scope, exchangeFactory) {
    setSingleEndDate($scope);
    findReplace($http, $scope, exchangeFactory);
}

function setSingleEndDate($scope) {
    for (var j = 0, sinlen = $scope.singleProducts.length; j < sinlen; j++) {
        var sinProduct = $scope.singleProducts[j];
        var s_beginDate = new Date(sinProduct.s_beginDate);
        sinProduct.s_endDate = new Date(s_beginDate.setMonth(s_beginDate.getMonth() + Number(sinProduct.s_Month), s_beginDate.getDate()));
    }
}

// ==========================unite==========================
function updateUniteData($http, $scope, exchangeFactory) {
    setUniteEndDate($scope);
    findReplace($http, $scope, exchangeFactory);
}

function setUniteEndDate($scope) {
    var u_beginDate = new Date($scope.unite_beginDate);
    $scope.unite_endDate = new Date(u_beginDate.setMonth(u_beginDate.getMonth() + Number($scope.unite_Month), u_beginDate.getDate()));
}

// ==========================获取差价接口==========================
function getOriginalDetails($scope) {
    var ncProIDArr = new Array();
    for (var i = 0, len = $scope.needChange.length; i < len; i++) {
        ncProIDArr.push($scope.needChange[i].detailId);
    }
    return ncProIDArr;
}

function getReplaceNewDetails($scope) {

    var replaceNewArr = new Array();

    for (var i = 0, len = $scope.uniteProducts.length; i < len; i++) {
        var productU = $scope.uniteProducts[i];
        var replaceDetails = {};

        replaceDetails.prodId  = productU.prodId;
        replaceDetails.quantity = productU.u_quantity;
        replaceDetails.deliverRules = $scope.unite_deliverRule;
//        replaceDetails.endDate = getEspeTyleDate(new Date(new Date().setDate(new Date().getDate() + 3)));
        replaceDetails.endDate = getEspeTyleDate($scope.unite_endDate);
        replaceDetails.startDate = getEspeTyleDate($scope.unite_beginDate);
        replaceNewArr.push(replaceDetails);
    }

    for (var j = 0, len = $scope.singleProducts.length; j < len; j++) {
        var productS = $scope.singleProducts[j];
        var replaceDetails = {};

        replaceDetails.prodId  = productS.prodId;
        replaceDetails.quantity = productS.s_quantity;
        replaceDetails.deliverRules = productS.s_deliverRule;
        replaceDetails.endDate = getEspeTyleDate(productS.s_endDate);
        replaceDetails.startDate = getEspeTyleDate(productS.s_beginDate) ;
        replaceNewArr.push(replaceDetails);
    }

    console.log('---------------replaceNewArr-------------');
    console.log(replaceNewArr);

    return replaceNewArr;
}

// ==========================确认更换接口==========================
function findReplace($http, $scope, exchangeFactory) {
    console.log('————————获取换奶品差价数据---------');
    var requestHost = "http://192.168.1.10:8080/kangnuo/order/findReplace";
//    var requestHost = "http://192.168.1.29:8080/kn2/order/findReplace";


    var orderId = exchangeFactory.getOrderId();
//    var userId = window.localStorage.getItem('key');
//    var userName = window.localStorage.getItem('loginName');
    var userId = exchangeFactory.getAddUser().userId;
    var userName = exchangeFactory.getAddUser().userName;
    var originalDetails = getOriginalDetails($scope);
    var replaceNewDetails = getReplaceNewDetails($scope);

    console.log('----------pagram---------')
    console.log('orderId-----' + orderId);
    console.log('userId-----' + userId);
    console.log('userName-----' + userName);
    console.log(originalDetails);
    console.log(replaceNewDetails);

    $http.post(http_changeMilkFindReplace,
        {
            "orderId": orderId,
            "userId": userId,
            "userName": userName,
            "originalDetails": originalDetails,
            "replaceNewDetails": replaceNewDetails
        })
        .success(function (data) {
            if (data.status == "SUCCESS") {
                console.log('----获取换奶品差价数据成功----');
                console.log(data.data);
                var myData = data.data;
                $scope.differencePrice = myData.detailPrice - myData.giftPrice - myData.giveMilkPrice - myData.changeDetailPrice;

            } else if (data.status == "error") {
                console.log('----失败----');
                alert('获取差价失败！')

            } else if (data.status == "INVALID") {
                console.log('----无效订单----');
                alert('该订单为无效订单!');

            } else if (data.status == "NORECORD") {
                console.log('----无结果----');
                alert('获取差价无结果!');

            } else if (data.status == "NOSETTLEMENT") {
                console.log('----没结算----');
                alert('该订单为未结算!')

            } else if (data.status == "PRICEERR") {
                console.log('----价格不符----');
                alert('价格不符！');

//            } else if (data.status == "EXPENSIVE") {
//                console.log('----更换商品贵于被换商品价格----');
//                alert('更换的商品总价不能高于被更换的商品总价！');

            } else if (data.status == "ALREADY") {
                console.log('----存在已审核订单----');
                alert('该订单正在换奶！');

            } else if (data.status == "TIMEERROR") {
                console.log('----时间错误----');
                alert('时间错误！');

            } else if (data.status == "GIVEORTIMEOUT") {
                console.log('----存在赠奶或时间错误----');
                alert('存在赠奶或时间错误！');

            }
        })
        .error(function (data) {
            console.log('获取换奶品差价数据失败');
        });
}

function replace($http, $scope, exchangeFactory,$state, $ionicLoading) {
    console.log('————————确认更换---------');
    var requestHost = "http://192.168.1.10:8080/kangnuo/order/replace";
//    var requestHost = "http://192.168.1.29:8080/kn2/order/replace";


    var orderId = exchangeFactory.getOrderId();
//    var userId = window.localStorage.getItem('key');
//    var userName = window.localStorage.getItem('loginName');
    var userId = exchangeFactory.getAddUser().userId;
    var userName = exchangeFactory.getAddUser().userName;
    var originalDetails = getOriginalDetails($scope);
    var replaceNewDetails = getReplaceNewDetails($scope);

    console.log('----------pagram---------')
    console.log('orderId-----' + orderId);
    console.log('userId-----' + userId);
    console.log('userName-----' + userName);
    console.log(originalDetails);
    console.log(replaceNewDetails);

    $http.post(http_changeMilkReplace,
        {
            "orderId": orderId,
            "userId": userId,
            "userName": userName,
            "originalDetails": originalDetails,
            "replaceNewDetails": replaceNewDetails
        })
        .success(function (data) {
            if (data.status == "SUCCESS") {
                console.log('----更换奶品成功----');
                $state.go("orderList");
                showSuccess($ionicLoading, '更换奶品成功！')

            }  else if (data.status == "error") {
                console.log('----更换奶品失败----');
                alert('更换奶品失败！')

            } else if (data.status == "INVALID") {
                console.log('----无效订单----');
                alert('该订单为无效订单!');

            } else if (data.status == "NORECORD") {
                console.log('----无结果----');
                alert('获取差价无结果!');

            } else if (data.status == "NOSETTLEMENT") {
                console.log('----没结算----');
                alert('该订单为未结算!')

            } else if (data.status == "PRICEERR") {
                console.log('----价格不符----');
                alert('价格不符！');

//            } else if (data.status == "EXPENSIVE") {
//                console.log('----更换商品贵于被换商品价格----');
//                alert('更换的商品总价不能高于被更换的商品总价！');

            } else if (data.status == "ALREADY") {
                console.log('----存在已审核订单----');
                alert('该订单正在换奶！');

            } else if (data.status == "TIMEERROR") {
                console.log('----时间错误----');
                alert('时间错误！');

            } else if (data.status == "GIVEORTIMEOUT") {
                console.log('----存在赠奶或时间错误----');
                alert('存在赠奶或时间错误！');

            }
        })
        .error(function (data) {
            showError($ionicLoading, '更换奶品失败!');
            console.log('----更换奶品失败----');
        });
}
