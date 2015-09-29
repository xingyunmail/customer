/**
 * Created by yu on 15-7-2.
 */

var isInterceptors = false;

function getStorage(key){
    return window.localStorage.getItem(key);
}
//显示加载等待
function showMessage($ionicLoading,message)
{
    $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner>'+(message||'加载中...'),
        noBackdrop: true
    });
}
//隐藏加载等待
function showHidden($ionicLoading)
{
    $ionicLoading.hide();

}
//加载成功提示
function showSuccess($ionicLoading,message)
{
    $ionicLoading.show({
        template: '<i class="icon ion-checkmark-round"></i>'+(message||'请求成功...'),
        noBackdrop: true,
        duration:1000


    });
}
//加载失败提示
function showError($ionicLoading,message)
{
    $ionicLoading.show({
        template: '<i class="icon ion-close-round"></i>'+(message||'请求失败...'),
//        template: (message||'请求失败...'),
        noBackdrop: true,
        duration:1000

    });

}

/**
 * URL 请求地址列表
 * created by sunhao
 * 2015-09-10
 */
var base_URL = 'http://test.kangnuo.com';


//shopping car
var http_getShoppingCar = base_URL+"/customer/shoppingCar";
var http_getProductDiscount = base_URL+"/activity/getProductDiscount";
var http_updateShoppingCar = base_URL+"/customer/updateCar";
var http_deleteShoppingCar = base_URL+"/customer/deleteCar";
var http_submitShoppingCar = base_URL+"/temporder/addTempOrderC";
var http_getAddressListByKey = base_URL+"/customer/getAddressList";
var http_addAddressByKey = base_URL+"/customer/addAddress";
var http_getCustomerAccountMoney = base_URL+"/customer/getMoney";

//用户中心
var http_getCustomerInfoByKey = base_URL+"/customer/getinfo";
var http_getPhoneByCity = base_URL+"/custservice/getPhone";

//启奶
var http_getActives = base_URL+"/order/getActives";
var http_actives = base_URL+"/order/active";

//登陆注册
var requestUrl = base_URL+"/";
//取消订单
//var requestHost = base_URL+"/order/getOrderById";
var http_requestCancelorder = base_URL+"/order/cancel?tempOrderId";


// homePage
var http_homeAdv = base_URL + "/adv/getAdvInfo";
var http_homeList = base_URL + "/channel/getProdInfobyCity";
var http_homeGetShopCount = base_URL + "/customer/shoppingCar";
var http_homeAddBuyCar = base_URL + "/customer/addCar";

// buySoon
var http_buySoonGetActiName = base_URL + "/activity/getActivityName?company=";
var http_buySoonGetActi =  base_URL + "/activity/getProductDiscount";

// orderList
var http_orderListNoSend = base_URL + "/order/getUnpaidOrders";
var http_orderListSending = base_URL + "/order/getDeliverOrders";
var http_orderListFinish = base_URL + "/order/getDeliverOrders";

// orderDetail
var http_orderDetailNoSend = base_URL + "/temporder/getTempOrder";
var http_orderDetailOther = base_URL + "/order/getOrderById";

// changeMilk
var http_changeMilkFindReplace =  base_URL + "/order/findReplace";
var http_changeMilkReplace = base_URL + "/order/replace";


// doorcollect
var http_doorcollectUpdatePhone = base_URL + "/customer/updatePhone";
var http_doorcollectCheck = base_URL + "/customer/check";
var http_doorcollectTmpTocust = base_URL + "/tempcust/tmpTocust";
var http_doorcollectSendsms = base_URL + "/code/sendsms";
var http_doorcollectAddTempOrderC = base_URL + "/temporder/addTempOrderC";

//personAccount
var http_personAccountGetPaylog = base_URL + "/customer/getpaylog";
var http_personAccountGetinfo = base_URL + "/customer/getinfo";


//welcome
var http_welcomeGetCity = base_URL + "/geo/getCity";
var http_welcomeCheck = base_URL + "/tempcust/check";
var http_welcomeAdd = base_URL + "/tempcust/add";

//productDetail
var http_getDetailURL = base_URL + "/channel/queryProdByProdId";

//address
var http_updateDefaultAddress = base_URL + "/customer/updateDefAddr";
var http_delAddress = base_URL + "/customer/delAddress";
var http_updateAddress = base_URL + "/customer/updateAddress";

//payment
var http_customerPayForOrder=base_URL+"/payment/customerPayForOrder";
var http_getCharge=base_URL+"/payment/getCharge";

//feedback
var http_customerFeedback = base_URL + '/customer/feedback';
var http_updateAddress = base_URL + "/customer/updateAddress";

