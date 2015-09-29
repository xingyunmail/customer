/**
 * Created by sunhao on 15/6/11.
 */
/*-----shopping car page--------------*/

//------controller----milkListCtrl---------------
shoppingcar.controller('milkListCtrl', ['$http', '$scope', '$ionicPopup','$cordovaToast', 'shopCarFactory',
    function ($http, $scope, $ionicPopup,$cordovaToast, shoppingCarFactory) {

        var milkList = [];
        var milkList_alone = [];
        var aloneShowList = [];
        var appCity = window.localStorage.getItem("city");
        var uuidKey = window.localStorage.getItem("key");


        //$http.post("http://192.168.1.23:8081/order/addSupltMilk", {"orderId": 'ay00037',"detail":[{"quantity" : 1,"price" : 3.0000000000000000,
        //    "deliverRules" : "EVERDAY", "beginDate" : "2015-08-11", "endDate" : "2015-08-15", "prodName" : "210g原味酸牛奶", "prodId" : "1008"}],"addUser":{"clazz":"model.order.Deliver", "deliverId" : "030301",
        //    "name" : "曹巧云","areaId" : "0303","area" : "安阳3区","lineId" : "03","lineName" : "安阳线"}}).success(function (responseData) {
        //
        //
        //})

        //get shoppingcar data function
        var getShoppingCarData = function () {
            aloneShowList = [];

            $http.post(http_getShoppingCar,
                { "key":uuidKey, "city": appCity }
            ).success(function (responseData) {

                if (responseData.status == "SUCCESS") {
                    milkList = responseData.data[0];
                    milkList_alone = responseData.data[1];

                }
                else {
                    milkList = [];
                    milkList_alone = [];
                }

                for (var i = 0; i < milkList_alone.length; i++) {

                    milkList_alone[i].beginDate = new Date(milkList_alone[i].beginDate);
                    milkList_alone[i].endDate = new Date(milkList_alone[i].endDate);
                    aloneShowList.push(true);

                }

                //show products alone and union
                $scope.milkInfos = milkList;
                $scope.milkInfos_alone = milkList_alone;
                //show alone setting
                $scope.aloneSetting = aloneShowList;
                //show union setting
                if (milkList.length > 0) {

                    $scope.allSetting = {
                        flag: true,
                        all_deliverRules: milkList[0].deliverRules == null ? "EVERDAY" : milkList[0].deliverRules,
                        all_deliverDays: milkList[0].deliverDays,
                        all_beginDate: new Date(milkList[0].beginDate),
                        all_endDate: milkList[0].endDate == "" ? new Date(milkList[0].beginDate) : new Date(milkList[0].endDate),
                        all_month: 13
                    }

                }

                //get the data of discount
                getDiscountData($http,$scope,[].concat(milkList, milkList_alone));

            }).error(function () {

                $scope.milkInfos = milkList;
                $scope.milkInfos_alone = milkList_alone;

            }).finally(function () {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');

            });

        };

        //get data of discount
        var getDiscountData = function ($http,$scope,details) {

            $http.post(http_getProductDiscount,
                { "company": "邯郸分公司", "detail": details}
            ).success(function (responseData) {

                if (responseData.status == "SUCCESS") {
                    $scope.discountList = responseData.data;
                    $scope.selDiscount = 0;
                    $scope.isGiftMilkDivShow = false;
                    $scope.isGiftDivShow = false;
                }
                else {
                    $scope.selDiscount = 0;
                    $scope.discountList = [];
                }

            });
        };

        //get data of shoppingCar to show
        getShoppingCarData();

        //pull down refresh
        $scope.doRefresh = function () {

            getShoppingCarData();
            $scope.$broadcast('scroll.refreshComplete');

        };

        //delete the product in shoppningCar
        $scope.deleteProd = function (prodid, flag) {

            if (flag == "union") {
                showDeleteConfirm(prodid, $http, $ionicPopup, milkList);
            }
            else if (flag == "alone") {
                showDeleteConfirm(prodid, $http, $ionicPopup, milkList_alone);
            }
        };

        //click to setting alone
        $scope.editeMilk = function (eprodid) {
            for (var i = 0; i < milkList.length; i++) {
                if (milkList[i].prodId == eprodid) {
                    //milkList[i].beginDate = new Date(milkList[i].beginDate);
                    milkList_alone.push(milkList[i]);
                    milkList.splice(i, 1);
                }
            }
            //show products of setting alone
            $scope.milkInfos_alone = milkList_alone;

        };

        //show empty shoppingCar
        $scope.emptyCar = setEmptyCar([].concat(milkList, milkList_alone));


        //get end date of union setting
        $scope.setAllEndDate = function (p_month) {
            var tmpDate = new Date($scope.allSetting.all_beginDate);
            $scope.allSetting.all_endDate = new Date(tmpDate.setMonth(tmpDate.getMonth() + p_month, tmpDate.getDate()));
        };

        //save union setting
        $scope.saveAllSetting = function () {

            var params = {"key": uuidKey, "shoppingCar": milkList, "city": appCity};

            if (new Date($scope.allSetting.all_beginDate) > new Date()
                && new Date($scope.allSetting.all_endDate) >= new Date($scope.allSetting.all_beginDate)) {
                for (var i = 0; i < milkList.length; i++) {
                    milkList[i].deliverRules = $scope.allSetting.all_deliverRules;
                    milkList[i].deliverDays = getDeliverDays($scope.allSetting.all_beginDate, $scope.allSetting.all_endDate, $scope.allSetting.all_deliverRules);
                    milkList[i].beginDate = $scope.allSetting.all_beginDate.Format("yyyy-MM-dd");
                    milkList[i].endDate = $scope.allSetting.all_endDate.Format("yyyy-MM-dd");
                    console.info(getDeliverDays($scope.allSetting.all_beginDate, $scope.allSetting.all_endDate, $scope.allSetting.all_deliverRules));
                    $scope.allSetting.all_deliverDays = milkList[i].deliverDays;

                }

                //save into db
                $http.post(http_updateShoppingCar, params).success(function (responseData) {
                    if (responseData.status == "SUCCESS") {
                        console.log("update success!");
                        $scope.allSetting.flag = false;

                        //refresh page to show the latest discount
                        getDiscountData($http, $scope, [].concat(milkList, milkList_alone));

                        //update validList
                        shoppingCarFactory.setVUnion($scope.allSetting.flag);
                    }
                    else {
                        console.log("update failed!");
                    }
                });

            }
            else {
                showPopupAlertDiv("开始/结束时间不正确", $ionicPopup);
            }
        };


        //get end date of setting alone
        $scope.setAloneEndDate = function (index, month) {

            var tempDate = new Date(milkList_alone[index].beginDate);

            milkList_alone[index].endDate = new Date(tempDate.setMonth(tempDate.getMonth() + month, tempDate.getDate()));

        };

        //save setting alone
        $scope.saveAloneSetting = function (index) {

            var milk = milkList_alone[index];

            milk.beginDate = new Date(milk.beginDate);
            milk.endDate = new Date(milk.endDate);

            if(milk.beginDate > new Date() && milk.endDate>=milk.beginDate) {

                milk.deliverDays = getDeliverDays(milk.beginDate, milk.endDate, milk.deliverRules);

                milk.beginDate = milk.beginDate.Format("yyyy-MM-dd");
                milk.endDate = milk.endDate.Format("yyyy-MM-dd");

                var params = {"key": uuidKey, "shoppingCar": [milkList_alone[index]], "city": appCity};

                //inset into db
                $http.post(http_updateShoppingCar, params).success(function (responseData) {
                    if (responseData.status == "SUCCESS") {
                        console.log("update success!");
                        $scope.aloneSetting[index] = false;

                        //refresh page to show the latest discount
                        getDiscountData($http, $scope, [].concat(milkList, milkList_alone));

                        //update validList
                        shoppingCarFactory.setVAlone(checkSaveButton($scope.aloneSetting));
                    }
                    else {
                        console.log("update failed!");
                    }
                });

            }
            else{
                showPopupAlertDiv("开始/结束时间不正确",$ionicPopup);
            }
        };


        //show edit div and hide the saved div
        $scope.showEditDiv = function (flag, index) {
            if (flag == "union") {
                $scope.allSetting.flag = true;
                shoppingCarFactory.setVUnion($scope.allSetting.flag);
            }
            else if (flag == "alone") {
                $scope.aloneSetting[index] = true;
                shoppingCarFactory.setVAlone(checkSaveButton($scope.aloneSetting));
            }
        };


        //choose the gift of disocunt。
        $scope.selectGift = function () {

            var selectedDiscount = JSON.parse($scope.selDiscount);

            if (0 != selectedDiscount) {
                if (null == selectedDiscount.gifts) {
                    $scope.disProdMilkList = selectedDiscount.products[0];
                    $scope.disProdMilkList.totalQuantity = $scope.disProdMilkList.quantity;
                    $scope.disProdMilkList.quantity = 1;
                    $scope.disProdMilkList.deliverDays = 0;
                    $scope.disProdMilkList.deliverRules = "EVERDAY";
                    $scope.disProdMilkList.beginDate = new Date();
                    $scope.disProdMilkList.endDate = new Date();

                    $scope.isGiftMilkDivShow = true;
                    $scope.isGiftMilkSetShow = true;
                    $scope.isGiftDivShow = false;
                    $scope.disGiftList = [];
                }
                else {

                    $scope.disGiftList = selectedDiscount.gifts[0];
                    shoppingCarFactory.setDiscount(selectedDiscount);
                    $scope.isGiftDivShow = true;
                    $scope.isGiftMilkDivShow = false;
                    $scope.disProdMilkList = [];
                }

            }
            else {
                $scope.isGiftMilkDivShow = false;
                $scope.isGiftDivShow = false;
            }

        };


        //set discount production end date
        $scope.setDiscountEndDate = function () {

            $scope.disProdMilkList.endDate = getEndDate($scope.disProdMilkList.deliverRules,
                Math.ceil($scope.disProdMilkList.totalQuantity / $scope.disProdMilkList.quantity),
                $scope.disProdMilkList.beginDate);

        };

        //save the gift milk deliver data
        $scope.saveGiftMilk = function () {

            var savedDiscount = JSON.parse($scope.selDiscount);

            savedDiscount.details = [$scope.disProdMilkList];
            shoppingCarFactory.setDiscount(savedDiscount);
            $scope.isGiftMilkSetShow = false;
        };

        //show gift milk edit div
        $scope.showEditGiftMilk = function () {
            $scope.isGiftMilkSetShow = true;
        };


        //set the total price
        setTotalPrice([].concat(milkList, milkList_alone), shoppingCarFactory);

        //watch allSetting
        $scope.$watch('allSetting', function () {
            for (var i = 0; i < milkList.length; i++) {
                milkList[i].deliverRules = $scope.allSetting.all_deliverRules;
                milkList[i].deliverDays = getDeliverDays($scope.allSetting.all_beginDate, $scope.allSetting.all_endDate, $scope.allSetting.all_deliverRules);
                milkList[i].beginDate = $scope.allSetting.all_beginDate.Format("yyyy-MM-dd");
                milkList[i].endDate = $scope.allSetting.all_endDate.Format("yyyy-MM-dd");
                $scope.allSetting.all_deliverDays = milkList[i].deliverDays;
            }
        }, true);

        //watch milkInfos
        $scope.$watch('milkInfos', function () {

            updateFactoryData([].concat(milkList, milkList_alone), $scope, shoppingCarFactory);


        }, true);

        //watch milkInfos_alone
        $scope.$watch('milkInfos_alone', function () {

            updateFactoryData([].concat(milkList, milkList_alone), $scope, shoppingCarFactory);

        }, true);

    }
]);


//update the data of shoppingcar factory
function updateFactoryData(details, $scope, shoppingCarFactory) {

    setTotalPrice(details, shoppingCarFactory);

    $scope.emptyCar = setEmptyCar(details);

    shoppingCarFactory.setDetails(details);
}

//show delete confirm dialog
function showDeleteConfirm(prodid, $http, $ionicPopup, milkList) {

    var confirmPopup = $ionicPopup.confirm({
        title: '删除产品',
        template: '确定删除购物车中这个产品？',
        okText: "确定",
        cancelText: "取消"

    });

    confirmPopup.then(function (res) {
        if (res) {

            var shopProd;
            var position;
            for (var i = 0; i < milkList.length; i++) {
                if (milkList[i].prodId == prodid) {
                    shopProd = milkList[i];
                    position = i;
                }
            }

            $http.post(http_deleteShoppingCar, {
                "key": window.localStorage.getItem("key"),
                "shoppingCar": [{"prodId": prodid,
                    "deliverDays":shopProd.deliverDays,
                    "deliverRules":shopProd.deliverRules,
                    "beginDate":new Date(shopProd.beginDate).Format("yyyy-MM-dd")}],
                "city": window.localStorage.getItem("city")
            }).success(function (responseData) {
                if (responseData.status == "SUCCESS") {
                    milkList.splice(position, 1);
                    console.log("delete success...");
                }
                else {
                    console.log("delete failed...");
                }
            });
        }
    });
}

// set the empty car div show or hide
function setEmptyCar(milkList) {
    return 0 == milkList.length;
}

//caculate total price
function setTotalPrice(milkInfoList, shoppingCarFactory) {

    var totalPrice = 0;

    for (var i = 0; i < milkInfoList.length; i++) {
        totalPrice += (milkInfoList[i].quantity * milkInfoList[i].price * milkInfoList[i].deliverDays);
    }

    shoppingCarFactory.setPrice(totalPrice.toFixed(2));

}

function checkSaveButton(settingList)
{
    var flag = false;
    for(var i=0;i<settingList.length;i++)
    {
        if(settingList[i])
        {
            flag = true;
            break;
        }
    }

    return flag;
}

//------controller----buyCarFootCtrl---------------
shoppingcar.controller('buyCarFootCtrl', ['$scope', '$state', '$ionicPopup','$cordovaToast', 'shopCarFactory',
    function ($scope, $state, $ionicPopup,$cordovaToast, shoppingCarFactory) {

        $scope.shoppingCarShow = shoppingCarFactory.getShoppingCar();

        //跳转到订单确认页面
        $scope.gotoConfirm = function () {

            var result = validateShoppingCar(shoppingCarFactory);

            if ("SUCCESS" == result) {

                $state.go("confirmOrder", {"page": "shoppingCar"});

            }
            else if("EMPTY" == result){

                var confirmPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '您还未选购任何商品',
                    okText: "去选购",
                    okType: 'button-kangnuo'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        $state.go("homePage");
                    }
                });
            }
            else if("NOT-SAVED" == result)
            {
                //$cordovaToast.showShortCenter("请先保存配送设置");
                $ionicPopup.alert({
                    title: '提示',
                    template: '请先保存配送设置',
                    okText: "确定",
                    okType: 'button-kangnuo'
                });
            }
        };

    }
]);


//校验购物车数据是否保存
function validateShoppingCar(shoppingCarFactory)
{
    var unionFlag = true;
    var AloneFlag = true;
    var details = shoppingCarFactory.getDetails();
    for (var i = 0; i < details.length; i++) {
        console.log(details[i]);
        if (details[i].isUnionSetting) {
            unionFlag = false;
        }
        else {
            AloneFlag = false;
        }
    }

    if (shoppingCarFactory.getDetails().length == 0) {
        return "EMPTY";
    }
    else if (!(unionFlag === shoppingCarFactory.getVUnion()) || !(AloneFlag === shoppingCarFactory.getVAlone())) {
        return "NOT-SAVED";
    }
    else {
        return "SUCCESS";
    }

}

//-----comfirm order page--------------

//-----controller----confirmOrderCtrl--------------
shoppingcar.controller('confirmOrderCtrl', ['$scope','$http', '$state', '$stateParams', 'shopCarFactory',
    function ($scope,$http, $state, $stateParams, shopCarFactory) {

        var shoppingCar = shopCarFactory.getShoppingCar();

        //获取订购产品显示
        $scope.milkInfos = shoppingCar.shareDetails;

        //获取活动显示
        var discount = shoppingCar.discount;

        if (0 != discount && null != discount && undefined != discount) {
            $scope.discountInfo = discount;
            $scope.isShowDiscount = true;

            if (null == discount.gifts) {
                $scope.isShowMilkGift = true;
                $scope.isShowRealGift = false;
            }
            else {
                $scope.isShowMilkGift = false;
                $scope.isShowRealGift = true;
            }
        }
        else {
            $scope.isShowDiscount = false;
        }

        //money
        $http.post(http_getCustomerAccountMoney,  {'key': window.localStorage.getItem("key")}).success(function (responseData) {
            if (responseData.status == "SUCCESS") {
                $scope.accountMoney = responseData.data.wallet.money;
            }
            else {
                $scope.accountMoney = 0;
            }
        });

        //请求数据获取默认地址
        $scope.address = $stateParams.value;

        $scope.$watch("address", function () {
            shopCarFactory.setAddress($scope.address);
        }, true);

        $scope.getSubmitPayMethod = function (val) {
            shopCarFactory.setPayMethod(val);
            console.log(shopCarFactory.getShoppingCar());
        };

        $scope.showAddress = function () {
            $state.go("selectAddr");
        }

    }
]);

//-----controller----commitOrderCtrl-确认订单--------
shoppingcar.controller('commitOrderCtrl', ['$scope', '$http', '$state', 'shopCarFactory', '$ionicPopup',
    function ($scope, $http, $state, shopCarFactory, $ionicPopup) {

        var shoppingCar = shopCarFactory.getShoppingCar();

        $scope.commitPrice = shoppingCar.totalPrice;


        $scope.commitOrder = function () {

            var address = shoppingCar.address;
            var payMethod = shoppingCar.payMethod;
            var details = shoppingCar.shareDetails;

            if ("" != details && undefined != details && 0 != details.length && "" != payMethod
                && undefined != payMethod && "NETPAY" == payMethod && undefined != address && "" != address) {
                var orderInfo = new Object();
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
                else
                {
                    orderInfo.discount = null;
                }
                orderInfo.progress = "NEW";

                console.log(JSON.stringify(orderInfo));

                $http.post(http_submitShoppingCar, orderInfo).success(function (responseData) {
                    if (responseData.status == "SUCCESS") {

                        var orderId = responseData.data.orderId;
                        if(undefined != orderId && "" != orderId){
                            //删除购物车内数据 clearCar 王璐直接删除后返回
                            //跳转到未付款订单详情支付页面
                            shopCarFactory.setDetails([]);
                            $state.go("orderDetail",{"orderId":orderId,"flag":0});

                        }
                        else{
                            showPopupAlertDiv(responseData.data, $ionicPopup);
                        }

                    }
                    else {
                        showPopupAlertDiv("订单提交失败", $ionicPopup);
                    }
                });

                //showPopupAlertDiv("<p>"+JSON.stringify(orderInfo)+"</p>",$ionicPopup);

            }
            else if ("" == details || undefined == details || 0 == details.length) {
                var confirmPopup = $ionicPopup.alert({
                    title: '<i class="ion-alert-circled assertive">提示</i>',
                    template: '<div>订单为空</div>',
                    okText: "去选购",
                    okType: 'button-kangnuo'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        $state.go("homePage");
                    }
                });

            }
            else if (null == address || undefined == address || "" == address) {
                showPopupAlertDiv("请填写收货地址", $ionicPopup);
            }
            else if ("" == payMethod || null == payMethod || undefined == payMethod) {
                showPopupAlertDiv("请选择支付方式", $ionicPopup);
            }
            else if ("DELEGATED" == payMethod) {
                $state.go("verifyphone");
            }

        };
    }
]);

function showPopupAlertDiv(content, $ionicPopup) {
    $ionicPopup.alert({
        title: '<i class="ion-alert-circled assertive">提示</i>',
        template: content,
        okText: "确定",
        okType: 'button-kangnuo'
    });
}

//-----controller----selectAddrCtrl-选择地址--------
shoppingcar.controller("selectAddrCtrl", ['$scope', '$http', '$state',
    function ($scope, $http, $state) {

        $scope.appCity = window.localStorage.getItem("city");

        //如何获取当前登录用户
        $http.get(http_getAddressListByKey,{params: {"key":window.localStorage.getItem("key"),"city":$scope.appCity}}).success(function (response) {
            $scope.address = response.data;
        });

        $scope.selectedAddr = function (addr) {
            $state.go("confirmOrder", {"value": addr, "page": "address"});
        };

        $scope.addNewAddress = function () {
            $state.go("newAddress");
        };

    }
]);

//-----controller:selectAddrCtrl新增地址--------
shoppingcar.controller("addAddressCtrl", ['$scope', '$http', '$state', '$ionicPopup','$ionicModal',
    function ($scope, $http, $state, $ionicPopup,$ionicModal) {

        $scope.contact = {
            "key": window.localStorage.getItem("key"),
            "name": '',
            "phone": "",
            "province": "河南省",
            "city": "",
            "district": "-请选择-",
            "address": ""
        };

        $scope.citys = [{name:"邯郸",district:["邯山区","丛台区","复兴区","峰峰矿区","邯郸县","临漳县","成安县","大名县","涉县"]},
            {name:"安阳",district:["林州市","安阳县","内黄县","汤阴县","文峰区","北关区","殷都区","龙安区","安阳新区"]},
            {name:"邢台",district:["宁晋县","清河县","内丘县","邢台县","隆尧县","任县","南和县","巨鹿县","广宗县","威县","临城县","新河县"]},
            {name:"武安",district:["武安镇","康二城镇","午汲镇","淑村镇","矿山镇","贺进镇","阳邑镇","徘徊镇"]}];

        $ionicModal.fromTemplateUrl('selectCity.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.cityModal = modal;
        });
        $scope.openCityModal = function() {
            $scope.cityModal.show();
        };
        $scope.closeCityModal = function(index) {
            $scope.contact.city =  $scope.citys[index].name;
            $scope.districts = $scope.citys[index].district;
            $scope.cityModal.hide();
            $scope.townModal.show();
        };
        $scope.$on('$destroy', function() {
            $scope.cityModal.remove();
        });

        $ionicModal.fromTemplateUrl('selectTown.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.townModal = modal;
        });
        $scope.closeTownModal = function(index) {
            $scope.townModal.hide();
            $scope.contact.district = $scope.districts[index];
        };
        $scope.$on('$destroy', function() {
            $scope.townModal.remove();
        });
        $scope.$on('townModal.removed', function() {
            $scope.districts = "";
        });





        $scope.addNewAddress = function () {
            $http.post(http_addAddressByKey, {}, {params: $scope.contact}).success(function (response) {
                if (response.status == 'SUCCESS') {
                    $state.go("selectAddr");
                }
                else {
                    showPopupAlertDiv("添加失败", $ionicPopup);
                }
            });
        };

    }
]);