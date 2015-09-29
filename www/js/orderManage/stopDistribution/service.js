/**
 * Created by zh on 15-7-06.
 */

starter.factory('stopDistributionFactory',function()
{
    var orderList = [];

    var getOrderList = function()
    {
        return orderList;
    }

    var setOrderList = function (obj) {
        orderList = obj;
    }

    return {
        getOrderList:getOrderList,
        setOrderList:setOrderList
    }



});
