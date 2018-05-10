
// 加载配置文件
const config = require( '../config.js' );

function formatTime( date ) {

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

function getProductList(data){
    proList = data.data.productList;
    //console.log(proList);
    //分类组装
    let classList = [];
    //console.log(data.data.classNames);
    for (let j = 0; j < data.data.classNames.length;j++){
      let classObj={};
      classObj.className = data.data.classNames[j];
      classObj.ids = data.data.idsForClass[j];
      classList.push(classObj);
    }
    //获取图片
    for (let i = 0; i < proList.length;i++){
      let str = proList[i].ProductPicSrc200;
      let tag =str.indexOf(" ");
      proList[i].ProductPicSrc200 = str.substring(0, tag).replace('http://172.31.1.215:8066','http://www.tp-linkshop.com.cn');
      try {
        proList[i].ProductDescLong = proList[i].ProductDescLong.match(/src=".*?"/ig).map(function (item) { return item.replace('src="', '').replace('"', '') });
      }
      catch (err) {
        proList[i].ProductDescLong = '';
      }
      
      //添加相应分类
      for(let k=0;k<classList.length;k++){
        let classArr = classList[k].ids.split(',');
        //console.log(classArr);
        for(let j=0;j<classArr.length;j++){
          if (proList[i].SysNo==classArr[j]){
            proList[i].className = classList[k].className;
            //是否在首页显示
            if (j < _this.data.showNum) {
              proList[i].visible = 1;
            } else {
              proList[i].visible = 0;
            }
          }
        }
      }
    }
    console.log(proList);
    //设置Storage--proList
    wx.setStorageSync('proList', proList);
    _this.setData({
      proList: proList,
      classList: classList
    })
}

// 格式化时间戳
function getTime( timestamp ) {
    var time = arguments[ 0 ] || 0;
    var t, y, m, d, h, i, s;
    t = time ? new Date( time * 1000 ) : new Date();
    y = t.getFullYear();    // 年
    m = t.getMonth() + 1;   // 月
    d = t.getDate();        // 日

    h = t.getHours();       // 时
    i = t.getMinutes();     // 分
    s = t.getSeconds();     // 秒

    return [ y, m, d ].map( formatNumber ).join('-') + ' ' + [ h, i, s ].map( formatNumber ).join(':');
    
}

module.exports = {

    formatTime: formatTime,
    getTime : getTime,

    AJAX : function( data = '', fn, method = "get", header = {}){
        wx.request({
            url: config.API_HOST + data,
            method : method ? method : 'get',
            data: {},
            header: header ? header : {"Content-Type":"application/json"},
            success: function( res ) {
                fn( res );
            }
        });
    },

    /**
     * 获取格式化日期
     * 20161002
     */
    getFormatDate : function( str ) {
            
        // 拆分日期为年 月 日
        var YEAR = str.substring( 0, 4 ),
            MONTH = str.substring( 4, 6 ),
            DATE = str.slice( -2 );

        // 拼接为 2016/10/02 可用于请求日期格式
        var dateDay = YEAR + "/" + MONTH + "/" + DATE;

        // 获取星期几
        var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            day = new Date( dateDay ).getDay();

        // 获取前一天日期 根据今天日期获取前一天的日期
        // var dateBefore = new Date( new Date( dateDay ) - 1000 * 60 * 60 * 24 ).toLocaleDateString();
        // var dateBefore = dateBefore.split('/');
        // if( dateBefore[1] < 10 ) {
        //     dateBefore[1] = '0' + dateBefore[1];
        // }
        // if( dateBefore[2] < 10 ) {
        //     dateBefore[2] = '0' + dateBefore[2];
        // }
        // dateBefore = dateBefore.join('');

        return {
            "dateDay" : MONTH + "月" + DATE + "日 " + week[ day ]
        }

    },

}
