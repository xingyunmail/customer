/**
 * Created by zhaijin on 15-7-8.
 */

//时间格式转换
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 * 运送规则转换
 * @param deliverRules
 * @returns {*}
 */
var changeDeliverRules = function(deliverRules){
    var pinlv;
    switch (deliverRules) {
        case 'EVERDAY':
            pinlv = '天天送';
            break;
        case 'NEXTDAY':
            pinlv = '隔日送';
            break;
        case 'WORKDAY':
            pinlv = '工作日送';
            break;
        case 'RESTDAY':
            pinlv = '周末送';
            break;
    }
    return pinlv;
};


/**
 *计算结束时间  根据运送规则 配送时长  开始配送时间
 * @param deliveRule  运送规则
 * @param deliverDays  配送时长
 * @param startDate   开始配送时间
 * @returns {Date}
 */
function getEndDate(deliveRule, deliverDays, startDate) {
    var endDate = new Date(startDate);
    deliverDays = Number(deliverDays);
    //天天送
    if (deliveRule == "EVERDAY") {
        endDate.setDate(endDate.getDate() + deliverDays);
        endDate.setDate(endDate.getDate() - 1);
    }
    //工作日送
    else if (deliveRule == "WORKDAY") {
        while (deliverDays > 0) {
            if (endDate.getDay() != 6 && endDate.getDay() != 0) {
                deliverDays = deliverDays - 1;
            }
            if (deliverDays > 0) {
                endDate.setDate(endDate.getDate() + 1);
            }
        }
    }
    //周末送
    else if (deliveRule == "RESTDAY") {
        while (deliverDays > 0) {
            if (endDate.getDay() == 6 || endDate.getDay() == 0) {
                deliverDays = deliverDays - 1;
            }

            if(deliverDays > 0)
            {
                endDate.setDate(endDate.getDate() + 1);
            }
        }

    }
    //隔天送
    else if (deliveRule == "NEXTDAY") {
        endDate.setDate(endDate.getDate() + ((deliverDays - 1) * 2));
    }

    return endDate;
}

/**
 * 根据开始时间、结束时间、配送规则计算配送天数
 * ceated by sunhao
 * @param beginDate    开始时间  参数类型：String/Date
 * @param endDate      结束时间  参数类型：String/Date
 * @param deliverRules 配送规则  参数类型：String
 */
function getDeliverDays(beginDate,endDate,deliverRules)
{
    var begin = new Date(beginDate);
    var end   = new Date(endDate);
    var deliverDays = 0;

    if((begin.getTime() - end.getTime()) <=0 &&
        (deliverRules == "EVERDAY" ||deliverRules == "WORKDAY" ||deliverRules == "RESTDAY" ||deliverRules == "NEXTDAY") ) {

        if (deliverRules == "EVERDAY") {
            deliverDays = (end.getTime() - begin.getTime()) / 86400000 +1;
        }
        else if (deliverRules == "WORKDAY") {
            while (begin <= end) {
                if (begin.getDay() != 6 && begin.getDay() != 0) {
                    deliverDays += 1;
                }
                begin.setDate(begin.getDate() + 1);
            }
        }
        else if (deliverRules == "RESTDAY") {
            while (begin <= end) {
                if (begin.getDay() == 6 || begin.getDay() == 0) {
                    deliverDays += 1;
                }
                begin.setDate(begin.getDate() + 1);
            }
        }
        else if (deliverRules == "NEXTDAY") {
            deliverDays = Math.floor((end.getTime() - begin.getTime()) / 86400000 / 2) + 1;
        }

    }

    return deliverDays;
}

//  全局变量 by xianChaoFan
starter.factory('buySoonFactory', function () {
    var shareValue = 0;
    var shareDetails = {};

    function setValue(totalValue) {
        shareValue = totalValue;
    }

    function getValue() {
        return shareValue;
    }


    function setDetails(details)
    {
        shareDetails = details;
    }

    function getDetails()
    {
        return shareDetails;
    }

    return {
        setDetails:setDetails,
        getDetails:getDetails,
        getValue: getValue,
        setValue: setValue

    }

});


/**
 * 根据配送规则、天数、时间得到infos
 * created by sunhao
 * @param deliverRules
 * @param deliverDays
 * @param beginDate
 * @returns {Array}
 */
function getInfos(deliverRules,deliverDays,beginDate)
{
    var infos = [];

    if(undefined != deliverRules && "" != deliverRules
        &&  undefined != deliverDays && '' != deliverDays && 0 != deliverDays
        && undefined != beginDate && '' != beginDate)
    {
        deliverDays = Number(deliverDays);
        beginDate = new Date(beginDate);

        var tmp_date = "";

        if("EVERDAY" == deliverRules )
        {
            while(deliverDays > 0)
            {
                tmp_date =  beginDate.Format("yyyy-MM-dd");
                infos.push(tmp_date);
                beginDate.setDate(beginDate.getDate() + 1);
                deliverDays -= 1;
            }

        }
        else if("WORKDAY" == deliverRules)
        {
            while(deliverDays > 0)
            {
                if(beginDate.getDay() != 6 && beginDate.getDay() != 0)
                {
                    tmp_date =  beginDate.Format("yyyy-MM-dd");
                    infos.push(tmp_date);
                    deliverDays -= 1;
                }
                beginDate.setDate(beginDate.getDate() + 1);
            }

        }
        else if("RESTDAY" == deliverRules)
        {
            while(deliverDays > 0)
            {
                if(beginDate.getDay() == 6 || beginDate.getDay() == 0)
                {
                    tmp_date =  beginDate.Format("yyyy-MM-dd");
                    infos.push(tmp_date);
                    deliverDays -= 1;
                }
                beginDate.setDate(beginDate.getDate() + 1);
            }
        }
        else if("NEXTDAY" == deliverRules)
        {
            var flag = true;
            while(deliverDays > 0)
            {
                if(flag)
                {
                    tmp_date =  beginDate.Format("yyyy-MM-dd");
                    infos.push(tmp_date);
                    deliverDays -= 1;
                    flag = false;
                }
                else
                {
                    flag = true;
                }
                beginDate.setDate(beginDate.getDate() + 1);
            }
        }
    }


    return  infos;
}