/**
 * Created by ZH on 15/6/17.
 */
starter.controller('PersonalController', ['$scope', '$interval', '$timeout', '$http', '$location', '$ionicPopup', '$ionicModal', '$state', 'addressFactory', '$ionicLoading', getInfo]);
function getInfo($scope, $interval, $timeout, $http, $location, $ionicPopup, $ionicModal, $state, addressFactory, $ionicLoading) {
    var addressResult = []
    //"http://192.168.1.10:8080/kangnuo/customer/getAddressList?key=9c4e4615e8a50c48"
    console.log(window.localStorage.getItem("key"))
    $http.post(http_getAddressListByKey, {}, {params: {key: window.localStorage.getItem("key")}}).
        success(function (json, status, headers, config) {
            showMessage($ionicLoading);
            console.log(json);
            if (json.status == "SUCCESS") {
                showHidden($ionicLoading);
                $scope.address = json.data;
                addressResult = $scope.address;
                console.log("查询地址：" + json.data[0].city + "," + json.data[0].district)
            }
            if (json.status == "ERROR") {
                showHidden($ionicLoading);
            }
            if (json.status == "NORECORD") {
                showHidden($ionicLoading);
            }
        }).
        error(function (data, status, headers, config) {
            showError($ionicLoading, "加载失败")
        });

    $scope.toaddress = function () {
        console.log("新增收货地址。");
        var addressInfo = [];
        //addressFactory.setAddressInfo(addressInfo);
        $location.path("/addaddress/false");
    };

    /**
     * 删除地址
     * @param contactId
     */
    $scope.deleteAddress = function (obj) {
        console.log("=删除下标：" + obj)
        var contactId;
        var confirmPopup = $ionicPopup.confirm({
            title: '提醒',
            template: '你确定要删除该地址吗？',
            okText: '确定',
            cancelText: '取消'
        });

        confirmPopup.then(function (res) {
            if (res) {
                var r = JSON.parse(obj);
                var delparams = {key: window.localStorage.getItem("key"), contactId: r.contactId}
                for (var i = 0; i < addressResult.length; i++) {
                    console.log(addressResult[i]);
                    if (addressResult[i].contactId == r.contactId) {
                        addressResult.splice(i, 1);
                    }
                }
                deleteAddressConfirm(delparams, $location, $http, $ionicLoading);
            }
        });
    };

    /**
     * 编辑地址
     */
    $scope.ediAddress = function (index) {
        for (var i = 0; i < $scope.address.length; i++) {
            if ($scope.address[i].contactId == index) {
                var addressInfo = {
                    name: $scope.address[i].name,
                    phone: $scope.address[i].phone,
                    address: $scope.address[i].address,
                    city: $scope.address[i].city,
                    district: $scope.address[i].district,
                    contactId: $scope.address[i].contactId
                };
                console.log("编辑地址：" + addressInfo.city + "," + addressInfo.district)
                addressFactory.setAddressInfo(addressInfo);
                $location.path("/addaddress/true");
            }
        }
    }
    /**
     * 设置默认地址
     */
    $scope.setIsDefault = function (address) {
        address.key = window.localStorage.getItem("key");
        address.location = null;
        console.log("设置默认：");
        console.log(address)
        ///"http://192.168.1.10:8080/kangnuo/customer/updateDefAddr"
        $http.post(http_updateDefaultAddress, {}, {params: address}).
            success(function (json, status, headers, config) {
                showMessage($ionicLoading);
                if (json.status == "SUCCESS") {
                    showHidden($ionicLoading)
                    console.log("设置默认成功！" + address.isDefault + "," + address.name);
                    window.location.reload();
                }
                if (json.status == "ERROR") {
                    showPopupAlertDiv("网络错误，请重试！", $ionicPopup);
                    showHidden($ionicLoading)
                }
            }).
            error(function (data, status, headers, config) {
                console.log(address.toString() + "设置默认失败！" + address.isDefault + "," + address.name + "," + address.location.lng);
                //showMessage($ionicLoading,"加载失败");
            });
    }
}
/**
 * 地址删除确认
 */
function deleteAddressConfirm(params, $location, $http, $ionicLoading) {
    showMessage($ionicLoading);
    //"http://192.168.1.10:8080/kangnuo/customer/delAddress"
    $http.post(http_delAddress, {}, {params: params}).
        success(function (json, status, headers, config) {
            if (json.status == "SUCCESS") {
                showHidden($ionicLoading);
                $location.path("/address");
                console.log("删除成功！");
            }
        }).
        error(function (data, status, headers, config) {
            // showMessage($ionicLoading,"删除失败");
        });
}

//新增加地址
starter.controller('PersonalAddressController', ['$scope', '$interval', '$http', '$location', '$state',
    "addressFactory", "$ionicLoading", "$stateParams", "$ionicPopup", "$ionicModal", saveAddressInfo]);
function saveAddressInfo($scope, $interval, $http, $location, $state, addressFactory, $ionicLoading, $stateParams, $ionicPopup, $ionicModal) {
    //城市
    $scope.areas = [
        {cityName: "邯郸", townName: ["邯郸县", "丛台区", "邯山区", "复兴区", "武安市"]},
        {cityName: "安阳", townName: ["殷都区", "龙安区", "文峰区", "开发区", "北关区"]},
        {cityName: "邢台", townName: ["邢台县", "南宫市", "沙河市", "任县", "清河县", "隆尧县", "临西县", "巨鹿县", "桥西区", "桥东区"]}
    ];
    var addressFlag = $stateParams.flag
    if (addressFlag == "true") {//判断是否编辑还是新增
        $scope.addressInfo = addressFactory.getAddressInfo();
        console.log("编辑：" + $scope.addressInfo.city + "," + $scope.addressInfo.district)
        // selectCityTown($scope.addressInfo.city, $scope.addressInfo.district, $scope.areas, $scope);
        $scope.cityn = $scope.addressInfo.city;
        $scope.townn = $scope.addressInfo.district;
        $scope.cityTown = $scope.addressInfo.district + " " + $scope.addressInfo.district;
    } else if (addressFlag == "false") {
        $scope.addressInfo = "";
    }
    /********************************弹出层开始**********************************************/
    $ionicModal.fromTemplateUrl('../view/personalCenter/my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.cityModal = $scope.areas;
        $scope.citychecked = true;
        $scope.townchecked = false;
    });
    var selectCityname;
    $scope.openModal = function (obj, v) {
        //弹出层过来为1 选择城市
        if (v == 1) {
            $scope.cityModal = $scope.areas;
            $scope.citychecked = true;
            $scope.townchecked = false;
        } else {//查询区县
            var tomwnName = new Array();
            selectCityname = obj.cityName;
            for (var i = 0; i < $scope.areas.length; i++) {
                if ($scope.areas[i].cityName == selectCityname) {
                    tomwnName = $scope.areas[i].townName
                }
            }
            $scope.townModal = tomwnName;
            $scope.townchecked = true;
            $scope.citychecked = false;
        }

        $scope.modal.show();
        console.log(tomwnName);
    };
    $scope.closeModal = function (obj) {
        $scope.modal.hide();
        if (obj == undefined) {
            obj = ""
        }
        if (selectCityname == undefined) {
            selectCityname = ""
        }
        $scope.cityTown = selectCityname + " " + obj
        $scope.cityn = selectCityname;
        $scope.townn = obj;


    };
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // 当隐藏的模型时执行动作
    $scope.$on('modal.hide', function () {
        // 执行动作
    });
    // 当移动模型时执行动作
    $scope.$on('modal.removed', function () {
        // 执行动作
    });
    /********************************弹出层结束**********************************************/
//提交
    $scope.addaddress = function () {
        var name = $scope.addressInfo.name;
        var phone = $scope.addressInfo.phone;
        var address = $scope.addressInfo.address;
        var city = $scope.cityn;
        var district = $scope.townn;
        var contactId = $scope.addressInfo.contactId;

        var isDefault = $scope.isDefault;
        if (isDefault == undefined) {
            isDefault = false;
        }
        if (name == null && name == undefined) {
            showPopupAlertDiv("收货人不能为空", $ionicPopup);
            return false;
        }
        if (phone == null && phone == undefined) {
            showPopupAlertDiv("联系方式不能为空", $ionicPopup);
            return false;
        }
        if (city == null && city == undefined) {
            showPopupAlertDiv("请选择所在地区", $ionicPopup);
            return false;
        }
        if (address == null && address == undefined) {
            showPopupAlertDiv("请填写详细地址", $ionicPopup);
            return false;
        }

        var flag = $stateParams.flag;
        var params = {
            key: window.localStorage.getItem("key"),
            name: name,
            phone: phone,
            province: "",
            city: city,
            district: district,
            address: address,
            isDefault: isDefault,
            contactId: contactId
        };
        console.log("-------------------------")
        console.log(params)
        console.log("-------------------------")
        if (contactId == undefined && contactId == null) {
            addAddress(http_addAddressByKey, flag, params, $location, $http, $ionicLoading, $state);
        } else {
            addAddress(http_updateAddress, flag, params, $location, $http, $ionicLoading, $state);
        }

        //验证地址的可信度
        /***
         $http.get("http://192.168.1.32:8080/kangnuo/geo/location?city="+city+"&address="+address).
         success(function(json, status) {
                if(json.status == "SUCCESS"){
                    var lng = json.data.lng;
                    var lat = json.data.lat;
                    var flag = $stateParams.flag;
                    var params = {key: '9c4e4615e8a50c48',name:name,phone:phone,province:"",city:city,district:district,address:address,lng:lng,lat:lat,isDefault:isDefault};
                    console.log(params)
                    addAddress(flag,params,$location,$http,$ionicLoading,$state);
                }else if(json.status == "DISTRUST"){
                    alert("请填写详细地址！");
                }
            }).
         error(function(data, status, headers, config) {
            });
         **/
    }
}

//新增加地址
function addAddress(url, flag, params, $location, $http, $ionicLoading, $state) {
    showMessage($ionicLoading);
    //"http://192.168.1.32:8080/kangnuo/customer/addAddress"
    $http.post(url, {}, {params: params}).
        success(function (json, status, headers, config) {
            if (json.status == "SUCCESS") {
                showHidden($ionicLoading);
                console.log("增加成功！");
                console.log(json);
                if (flag == 1) {
                    $state.go("changeAddress");
                } else {
                    $location.path("/address");
                }
            }
        }).
        error(function (data, status, headers, config) {
            showMessage($ionicLoading, "添加失败");
            showHidden($ionicLoading);
        });
}
//城市级联
function selectCityTown(city, district, areas, $scope) {
    for (var i = 0; i < $scope.areas.length; i++) {
        if ($scope.areas[i].cityName == city) {
            $scope.towns = $scope.areas[i].townName;
        }
    }
    $scope.city = city;
    $scope.town = district;
}
