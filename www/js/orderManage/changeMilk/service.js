/**
 * Created by sunhao on 15/6/23.
 */


starter.factory('exchangeFactory', function () {
    var milks = [];
    var products = [];
    var needs = [];
    var orderId = '';
    var addUser = {};

    var getAddUser = function () {
        return addUser;
    }

    var setAddUser = function (user) {
        addUser = user;
    }


    var getOrderId = function () {
        return orderId;
    }

    var setOrderId = function (orderID) {
        orderId = orderID;
    }

    var getMilks = function () {
        return milks;
    }

    var setMilks = function (milkList) {
        milks = milkList;
    }

    var getNeeds = function () {
        return needs;
    }

    var setNeeds = function (needList) {
        needs = needList;
    }
    var getProducts = function () {
        return products;
    }

    var setProducts = function (prodList) {
        products = prodList;
    }

    var getProdStr = function () {
        var prodStr = '';
        for (var i = 0; i < products.length; i++) {
            prodStr += ( products[i] + ",");
        }

        return prodStr.substr(0, prodStr.length - 1);
    }

    return {

        getAddUser: getAddUser,
        setAddUser: setAddUser,
        getProducts: getProducts,
        setProducts: setProducts,
        getProdStr: getProdStr,
        setMilks: setMilks,
        getMilks: getMilks,
        setNeeds: setNeeds,
        getNeeds: getNeeds,
        getOrderId: getOrderId,
        setOrderId: setOrderId
    }
});


