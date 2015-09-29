/**
 * Created by sunhao on 15/6/11.
 */

shoppingcar.factory('shopCarFactory', function () {

    var shoppingCar ={};
    var validList = {"validAlone":true,"validUnion":true};

    function setPrice(totalValue) {
        shoppingCar.totalPrice = totalValue;
    }

    function getPrice() {
        return shoppingCar.totalPrice;
    }

    function setDetails(details)
    {
        shoppingCar.shareDetails = details;
    }

    function getDetails()
    {
        return shoppingCar.shareDetails;
    }

    function setDiscount(discount)
    {
        shoppingCar.discount = discount;
    }

    function getDiscount()
    {
        return shoppingCar.discount;
    }

    function setAddress(address)
    {
        shoppingCar.address = address;
    }

    function getAddress()
    {
        return shoppingCar.address;
    }

    function setPayMethod(payMethod)
    {
        shoppingCar.payMethod = payMethod;
    }

    function getPayMethod()
    {
        return shoppingCar.payMethod;
    }

    function getValidAlone()
    {
        return validList.validAlone;
    }

    function setValidAlone(valid)
    {
        validList.validAlone = valid;
    }

    function getValidUnion()
    {
        return validList.validUnion
    }

    function setValidUnion(valid)
    {
         validList.validUnion = valid;
    }

    function getValidList()
    {
        return validList;
    }

    function getShoppingCar()
    {
        return shoppingCar;
    }

    function setShoppingCar(shoppingcar)
    {
        shoppingCar = shoppingcar;
    }

    return {
        setDetails:setDetails,
        getDetails:getDetails,
        setPrice: setPrice,
        getPrice:getPrice,
        getDiscount:getDiscount,
        setDiscount:setDiscount,
        getAddress:getAddress,
        setAddress:setAddress,
        getPayMethod:getPayMethod,
        setPayMethod:setPayMethod,
        getShoppingCar:getShoppingCar,
        setShoppingCar:setShoppingCar,
        getVAlone:getValidAlone,
        setVAlone:setValidAlone,
        getVUnion:getValidUnion,
        setVUnion:setValidUnion,
        getVList:getValidList
    }

});


