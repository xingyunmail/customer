/**
 * Created by lining on 15-6-23.
 */

starter.factory('changeAddressFactory',function()
{
    var selected = "";

    function setValue(addressInfo)
    {
        selected = addressInfo;
    }

    function getValue()
    {
        return selected;
    }

    return{
        getValue : getValue,
        setValue : setValue
    }

});
