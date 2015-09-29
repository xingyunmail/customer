/**
 * Created by zh on 15/7/14.
 */

starter.factory('addressFactory',function()
{
    var addressInfo = [];

    var getAddressInfo = function()
    {
        return addressInfo;
    }

    var setAddressInfo = function (address) {
        addressInfo = address;
    }

    return {
        getAddressInfo:getAddressInfo,
        setAddressInfo:setAddressInfo
}

});