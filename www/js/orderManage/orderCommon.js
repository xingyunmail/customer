/**
 * Created by xianChaoFan on 15/7/13.
 */

function computeMoney(remain, quantity, price) {
//    console.log( 'remain-----' + remain);
//    console.log( 'quantity-----' + quantity);
//    console.log( 'price-----' + price);

    return parseFloat(remain * quantity * price).toFixed(2);//强制转换为保留两位小数点的浮点型
}

// 根据stopDate 和 余量 获取状态
function judgeStateBase(stopDate, remain) {
    //console.log('stopDate-----' + stopDate);
    //console.log('remain-----' + remain);

    if (remain == 0) {
        return '已完结';
    } else if (stopDate == '' || stopDate.length == 0) {
        return '配送中';
    } else {
        return '已暂停';
    }
}


//// 获得余量
//function getRemainMilkCount (info,length) {
//
//    if (length == 0 || info == null) {
//        return 0;
//    } else {
//
//        var remainDays = new Array();
//        for (var i = 0; i < length; i++) {
//            if (compareTwoDays(getNowFormatDate(),info[i]) <= 0) {
//                remainDays.push(info[i]);
//            }
//        }
//        var remain = remainDays.length;
////        console.log('余量=天数-----' + remain);
//        return remain;
//    }
//}

// 获得余量
function getRemainMilkCount(info) {

    if (info == null) {
//        console.log('info == null');
        return 0;
    }

    if (info.length == 0) {
//        console.log('info.length == 0');
        return 0;
    }


//    console.log('-----由info计算余量------');
    var remainDays = new Array();
    var remain = 0;
    for (var i = 0; i < info.length; i++) {

        if (compareTwoDays(getNowFormatDate(), info[i]) <= 0) {
            remainDays.push(info[i]);
        }
    }
    remain = remainDays.length;
//        console.log('余量=天数-----' + remain);
    return remain;
}

// 获取当前日期 并将其格式装换为 YYYY-MM-dd
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getEspeTyleDate(date) {
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

// 比较两个日期的大小 日期格式为 YYYY-MM-dd
function compareTwoDays(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));
    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));
    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return cha;
}

// 计算单笔订单总价
function computeTotalMoney(detail) {
//    console.log(detail);
    var computeMoney = 0;

    for (var j = 0, len2 = detail.length; j < len2; j++) {
        var prod = detail[j];
//        console.log(prod);

        if (prod.info == '' || prod.info == null) {
            computeMoney = 0;
        } else {
            computeMoney += getRemainMilkCount(prod.info, prod.info.length) * prod.quantity *
                prod.price;
        }

//        console.log('computeMoney---------' + computeMoney);
    }

    return computeMoney;// 保留小数点后两位
}
