/**
 * Created by kevin on 16/11/8.
 */
var util = require('./util');
var request = require('request');
var crypto = require('crypto');
// var md5 = require('MD5');

exports = module.exports = WXPay;

function WXPay() {

    if (!(this instanceof WXPay)) {
        return new WXPay(arguments[0]);
    };

    this.options = arguments[0];
    this.wxpayID = { appid:this.options.appid, mch_id:this.options.mch_id };
};

WXPay.mix = function(){

    switch (arguments.length) {
        case 1:
            var obj = arguments[0];
            for (var key in obj) {
                if (WXPay.prototype.hasOwnProperty(key)) {
                    throw new Error('Prototype method exist. method: '+ key);
                }
                WXPay.prototype[key] = obj[key];
            }
            break;
        case 2:
            var key = arguments[0].toString(), fn = arguments[1];
            if (WXPay.prototype.hasOwnProperty(key)) {
                throw new Error('Prototype method exist. method: '+ key);
            }
            WXPay.prototype[key] = fn;
            break;
    }
};


WXPay.mix('option', function(option){
    for( var k in option ) {
        this.options[k] = option[k];
    }
});


WXPay.mix('sign', function(param){

    var querystring = Object.keys(param).filter(function(key){
            return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
        }).sort().map(function(key){
            return key + '=' + param[key];
        }).join("&") + "&key=" + this.options.partner_key;

    var sign = crypto.createHash('md5').update(querystring, 'utf8').digest('hex');
    return sign.toUpperCase();
});



/*
 * 扫码支付方式一 固定二维码*/

WXPay.mix('createMerchantPrepayUrl', function(param){

    param.time_stamp = param.time_stamp || Math.floor(Date.now()/1000);
    param.nonce_str = param.nonce_str || util.generateNonceString();
    util.mix(param, this.wxpayID);
    param.sign = this.sign(param);

    var query = Object.keys(param).filter(function(key){
        return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key)>=0;
    }).map(function(key){
        return key + "=" + encodeURIComponent(param[key]);
    }).join('&');

    return "weixin://wxpay/bizpayurl?" + query;
});

/*
 * 扫码支付方式二 非固定二维码 统一下单接口*/
WXPay.mix('createUnifiedOrder', function(opts, fn){

    opts.nonce_str = opts.nonce_str || util.generateNonceString();
    util.mix(opts, this.wxpayID);
    opts.sign = this.sign(opts);

    request({
        url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
        method: 'POST',
        body: util.buildXML(opts),
        agentOptions: {
            pfx: this.options.pfx,
            passphrase: this.options.mch_id
        }
    }, function(err, response, body){
        util.parseXML(body, fn);
    });
});


/*
 * 微信内网页js支付*/
WXPay.mix('getBrandWCPayRequestParams', function(order, fn){

    order.trade_type = "JSAPI";
    var _this = this;
    this.createUnifiedOrder(order, function(err, data){
        var reqparam = {
            appId: _this.options.appid,
            timeStamp: Math.floor(Date.now()/1000)+"",
            nonceStr: data.nonce_str,
            package: "prepay_id="+data.prepay_id,
            signType: "MD5"
        };
        reqparam.paySign = _this.sign(reqparam);
        fn(err, reqparam);
    });
});

/*
 * 微信外部网页H5支付*/
WXPay.mix('createOutH5Pay', function(order, fn){
    order.trade_type = "WAP";
    var _this = this;
    this.createUnifiedOrder(order, function(err, data){
        console.log(data);
        /*var param = {
         sign: 000,
         mch_id:999,
         product_id: 000
         };
         var query = Object.keys(param).filter(function(key){
         return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key)>=0;
         }).map(function(key){
         return key + "=" + encodeURIComponent(param[key]);
         }).join('&');*/

        /*var reqparam = {
         appId: _this.options.appid,
         timeStamp: Math.floor(Date.now()/1000)+"",
         nonceStr: data.nonce_str,
         package: "prepay_id="+data.prepay_id,
         signType: "MD5"
         };
         //appid=wxf5b5e87a6a0fde94&noncestr=123
         //&package=WAP&prepayid=wx20141210163048
         //0281750c890475924233&
         //sign=53D411FB74FE0B0C79CC94F2AB0E2333&timestamp=1417511263

         reqparam.paySign = _this.sign(reqparam);
         fn(err, reqparam);*/
    });
});
/**
 * 企业付款
 */
WXPay.mix('createEnterprisePay', function(opts, fn){
    opts.nonce_str = opts.nonce_str || util.generateNonceString();
    opts.mch_appid = this.options.appid;
    opts.mchid = this.options.mch_id;

    if (!opts.openid) throw new Error('openid must be...');
    opts.openid = opts.openid;
    opts.check_name = 'NO_CHECK';
    opts.desc = opts.desc || '测试企业支付';
    opts.spbill_create_ip = opts.spbill_create_ip || '180.149.133.153';
    opts.amount = opts.amount || 100;
    opts.partner_trade_no = opts.partner_trade_no;

    opts.sign = this.sign(opts);

    request({
        url: "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers",
        method: 'POST',
        body: util.buildXML(opts),
        agentOptions: {
            pfx: this.options.pfx,
            passphrase: this.options.mch_id
        }
    }, function(err, response, body){
        util.parseXML(body, fn);
    });
});


/*
 * 刷卡支付*/

//swiping card

WXPay.mix('swipingCardPay', function(opts, fn){
    opts.appid = this.options.appid;
    opts.mch_id = this.options.mch_id;
    opts.nonce_str = opts.nonce_str || util.generateNonceString();

    if (!opts.body) throw new Error('body must be...');

    opts.device_info = opts.device_info || '013467007045764';
    opts.spbill_create_ip = opts.spbill_create_ip || '180.149.133.153';
    opts.total_fee = opts.total_fee || 100;
    //opts.goods_tag = opts.goods_tag || '';
    //opts.attach = opts.attach || '';

    opts.sign = this.sign(opts);

    console.log(opts);
    //console.log(util.buildXML(opts))

    request({
        url: "https://api.mch.weixin.qq.com/pay/micropay",
        method: 'POST',
        body: util.buildXML(opts),
        agentOptions: {
            pfx: this.options.pfx,
            passphrase: this.options.mch_id
        }
    }, function(err, response, body){
        util.parseXML(body, fn);
    });
});


/*
 * 支付回调*/
WXPay.mix('useWXCallback', function(fn){

    return function(req, res, next){
        var _this = this;
        res.success = function(){ res.end(util.buildXML({ xml:{ return_code:'SUCCESS' } })); };
        res.fail = function(){ res.end(util.buildXML({ xml:{ return_code:'FAIL' } })); };

        util.pipe(req, function(err, data){
            var xml = data.toString('utf8');
            util.parseXML(xml, function(err, msg){
                req.wxmessage = msg;
                fn.apply(_this, [msg, req, res, next]);
            });
        });
    };
});

/**
 * [description] 订单查询
 * @param  {[type]} query         [description]
 * @param  {[type]} fn){	if      (!(query.transaction_id ||                           query.out_trade_no)) {		fn(null,  { return_code: 'FAIL', return_msg:'缺少参数' });	}	query.nonce_str [description]
 * @param  {[type]} function(err, res,                    body){		util.parseXML(body, fn);	});}          [description]
 * @return {[type]}               [description]
 */
WXPay.mix('queryOrder', function(query, fn){

    if (!(query.transaction_id || query.out_trade_no)) {
        fn(null, { return_code: 'FAIL', return_msg:'缺少参数' });
    }

    query.nonce_str = query.nonce_str || util.generateNonceString();
    util.mix(query, this.wxpayID);
    query.sign = this.sign(query);

    request({
        url: "https://api.mch.weixin.qq.com/pay/orderquery",
        method: "POST",
        body: util.buildXML({xml: query})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});

/**
 * [description] 订单关闭
 * @param  {[type]} order         [description]
 * @param  {[type]} fn){	if      (!order.out_trade_no) {		fn(null,                 {          return_code:"FAIL", return_msg:"缺少参数" });	}	order.nonce_str [description]
 * @param  {[type]} function(err, res,                  body){		util.parseXML(body, fn);	});} [description]
 * @return {[type]}               [description]
 */
WXPay.mix('closeOrder', function(order, fn){

    if (!order.out_trade_no) {
        fn(null, { return_code:"FAIL", return_msg:"缺少参数" });
    }

    order.nonce_str = order.nonce_str || util.generateNonceString();
    util.mix(order, this.wxpayID);
    order.sign = this.sign(order);

    request({
        url: "https://api.mch.weixin.qq.com/pay/closeorder",
        method: "POST",
        body: util.buildXML({xml:order})
    }, function(err, res, body){
        util.parseXML(body, fn);
    });
});