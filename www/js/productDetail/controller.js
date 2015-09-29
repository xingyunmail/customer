/**
 * Created by ZH on 15/6/15.
 */
starter.controller('productCtrl', ['$scope', '$http', '$state', '$stateParams', 'buySoonFactory', buyProductInfo]);
function buyProductInfo ($scope, $http, $state, $stateParams, buySoonFactory){

    var productInfo = buySoonFactory.getDetails();
    console.log("--商品详情--"+productInfo.city)
    console.log(productInfo)
//获取商品详情
    var _prodId = productInfo.prodId;
    var _city= productInfo.city;
    var result  = {products:[{prodId:_prodId}],city:_city}
    //var getDetailURL = "http://192.168.1.10:8080/kangnuo/channel/queryProdByProdId";
    $http.post(http_getDetailURL,result )
        .success(function (json) {
            if (json.status == "SUCCESS") {
                console.log('商品详情描述');
                console.log(json.data);
                $scope.productInfo = json.data;
            }
        })
        .error(function (json) {
            console.log('查询商品详情失败');
        });

    //添加到购物车
    $scope.productInfoAddShoppintcar = function(){
        console.log("--添加到购物车--"+window.localStorage.getItem("key"));
        //var requestHost = "http://192.168.1.10:8080/kangnuo/customer/addCar";
        var product =  {"key": window.localStorage.getItem("key"), "shoppingCar": [
            {"prodId": productInfo.prodId, "prodName":productInfo.prodName, "price": productInfo.price,
                "beginDate": new Date(new Date().setDate(new Date().getDate()+1)).Format("yyyy-MM-dd"), "endDate": '', "deliverRules": 'EVERDAY',
                "prodType": 'BYORDER', "image": productInfo.icon, "deliverDays":'', "isUnionSetting": true,
                "insertDate": new Date().Format("yyyy-MM-dd"), "city":productInfo.city}
        ]}
            console.log(product)
        $http.post(http_homeAddBuyCar,product )
            .success(function (data) {
                if (data.status == "SUCCESS") {
                    console.log('加入购物车成功');
                  //  getShoppingCarCount($http, $scope);
                    alert('加入购物车成功');
                }
            })
            .error(function (data) {
                console.log('加入购物车失败');
                alert('加入购物车失败');
            });

    }
    $scope.productInfoBuysoon = function(){
        console.log("--立即购买--");
            console.log(productInfo);
            buySoonFactory.setDetails(productInfo);
            $state.go("buySoon");
    }
}

