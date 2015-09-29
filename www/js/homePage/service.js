/**
 * Created by sunhao on 15/6/11.
 */

starter.factory('shoppingCarFactory',function()
{
    var shareValue = 0;

    function setValue(totalValue)
    {
        shareValue = totalValue;
    }

    function getValue()
    {
        return shareValue;
    }

    return{
        getValue : getValue,
        setValue : setValue
    }

});