/**
 * Created by sunhao on 15/6/23.
 */


starter.factory('exchangeFactory',function()
{
    var products = [];
    
    var getProducts = function()
    {
        return products;
    }
    
    var setProducts = function (prodList) {
        products = prodList;
    }

    var getProdStr = function ()
    {
        var prodStr = '';
        for(var i=0;i<products.length;i++)
        {
            prodStr += ( products[i]+",");
        }

        return prodStr.substr(0,prodStr.length-1);
    }

    return {
        getProducts:getProducts,
        setProducts:setProducts,
        getProdStr:getProdStr
    }
});