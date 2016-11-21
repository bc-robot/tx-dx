/**
 * Created by kevin on 16/8/10.
 */
var Router = require('koa-router');
var jwt = require('jsonwebtoken');
var jwt_auth = require('../lib/jwt_auth');
var crypto = require('crypto');
var mu = require('../lib/myUtil');
var md5 = require('MD5');
var request = require('co-request');
var svgCaptcha = require('svg-captcha');
var gb_secrets = require('../../../../gb-secrets/gb-dx');

// var jwt_secret = gb_secrets.jwt_secret;
var str_appkey = gb_secrets.str_appkey;
var sdk_appid = gb_secrets.sdk_appid;

function register(app) {
    var router = new Router({
        prefix: '/api'
    });
    router.get('/send/test', function *() {
        this.body = RES.SUCCESS('getout of here');
    });

    /**
     * @api {post} /api/send 发送短信
     * @apiVersion 0.0.1
     * @apiName APIsend
     * @apiGroup API
     * @apiPermission none
     *
     * @apiDescription 短信发送描述.
     * @apiDescription ID：4242    通知客服有老师提出认证用户{1}联系电话{2}，希望认证成为{3}院校的教师，请您尽快登录网站后台进行审核。
     * @apiDescription ID：4240    成功认证为老师您希望认证为{1}教师的申请已经通过，接下来您可以随时登录我们的网站，快速发布课程设计、毕业设计或实验作业了！
     * @apiDescription ID：4230    用户注册验证码您的验证码是{1}，有效时间{2}分钟，请不要告诉他人，如非本人操作请忽略此短信。
     * @apiDescription ID：5038    成功认证为企业您希望认证为{1}企业的申请已经通过，接下来您可以随时登录我们的网站，轻松招聘或发布实习任务考验人才，数百院校高材生任你挑选，任何需求的产品免费为您开发！
     * @apiDescription ID：5032    通知客服有企业提出认证用户{1}联系电话{2}，希望认证成为{3}企业用户，请您尽快登录网站后台进行审核。
     *
     * @apiParam {String} tel  phone NO.
     * @apiParam {Number} tpl_id  template ID.
     * @apiParam {Array} params  template content array.
     * @apiParam {String} exp  13位过期时间.
     *
     * @apiParamExample {json} Request-Example:
     *   {
     *     "tel": 11011912020,
     *     "tpl_id": 110,
     *     "params": ["验证码", "1234", "4"],
     *     "ext": "可选字段"  //可选字段，不需要就填空。用户的session内容，腾讯server回包中会原样返回
     *     "exp": "1000000000000"  // Data.now() + 1000
     *   }
     *
     *
     *
     * @apiParamExample {json} Success-Example
     *
     *   {
     *     status: { code: 0, httpcode: 200 },
     *     data:
     *       { result: '0',
     *         errmsg: 'OK',
     *         ext: '',
     *         sid: '8:Se9tJwqtwU9TjwIpq6T20161117',
     *         count: 1,
     *         fee: 2
     *       },
     *     msg: ''
     *   }
     *
     * @apiSuccess {String} status 成功状态
     * @apiSuccess {Json} data  服务器返回数据(result:0 发送成功).
     * @apiSuccess {String} msg  空(保留字段)
     *
     *
     *
     * @apiParamExample {json} Error-Example
     * {
     *   status:
     *   { code: -1, httpcode: 500 },
     *   data:
     *   {
     *       name: 'JsonWebTokenError',
     *       message: 'invalid signature'
     *   },
     *   msg: '验证出错'
     *  }
     *
     * @apiError {String} status 失败状态
     * @apiError {Json} data name(出错类型),message(出错信息)
     * @apiError {String} msg 服务器批注
     *
     */
    router.post('/send', function *() {
        console.log(this.request.body, 'this is request');
        console.log(gb_secrets);
        var jwt_auth_result = this.jwt_auth_result;
        console.log(this.jwt_auth_result, 'this is jwt access token!!');

        var headers = {
            'Content-Type': 'application/json'
        };
        var strPhone = jwt_auth_result.tel;

        // var sig = crypto.createHash('md5').update((strAppkey+strPhone).toString()).digest('hex');
        var appPhone = str_appkey + strPhone;
        var sig = md5(appPhone);

        console.log(sig, 'this is sig','-- - - - - -- -> strAppkey', str_appkey);

        var msg = {
            "tel": {
                "nationcode": "86", //国家码
                "phone": strPhone //手机号码
            },
            "type": "0", //0:普通短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
            // "sign": "腾讯云", //短信签名，如果使用默认签名，则可以缺省此字段
            "tpl_id": jwt_auth_result.tpl_id, //业务在控制台审核通过的模板ID - - - - - - - - - - - - - - - -
            //假定这个模板为：您的{1}是{2}，请于{3}分钟内填写。如非本人操作，请忽略本短信。
            "params": jwt_auth_result.params, //参数列表，将依次替换模板中的参数 - - - - - - - - - - - - - - - -
            "sig": sig, //app凭证，具体计算方式见下注
            "extend": "", //可选字段，默认没有开通(需要填空)。通道扩展码，
            //在短信回复场景中，腾讯server会原样返回，开发者可依此区分是哪种类型的回复
            "ext": jwt_auth_result.ext ? jwt_auth_result.ext : "" //可选字段，不需要就填空。用户的session内容，腾讯server回包中会原样返回
        }
        console.log(msg, 'this is msmsmsmsmsmsmssmmsmsmsmsmsmsmg')

        var random = mu.generateNonceString();

        console.log(random, 'this is random', " >>>>>>>>>>>", sdk_appid);

        var options = {
            url: 'https://yun.tim.qq.com/v3/tlssmssvr/sendsms?sdkappid='+sdk_appid+'&random=' + random,
            method: 'POST',
            headers: headers,
            json: msg
        }

        let result = yield request(options);
        let body = result.body;
        console.log('Body: ', body);
        this.set('content-type', 'application/json');
        this.body = RES.SUCCESS(body);
    });


    /**
     * @api {post} /api/captcha 生成验证码
     * @apiVersion 0.0.1
     * @apiName APIcaptcha
     * @apiGroup API
     *
     * @apiDescription 注意可以不传参数,但是必须用jwt传输
     *
     * @apiParam {Number} size  验证码位数(NULL)
     * @apiParam {String} ignoreChars  不包含的字符(NULL)
     *
     *
     * @apiParamExample {json} Success-Example
     *
     *   {
     *     status: { code: 0, httpcode: 200 },
     *     data:
     *     {
     *       text: 'HjJu',
     *       captcha: 'svg'
     *     },
     *     msg: ''
     *   }
     *
     *
     * @apiSuccess {Json} data "text":"验证码", "captcha": "svg格式字符串"
     *
     *
     * @apiError {Json} status  "code": "-1"
     */
    router.post('/captcha', function *() {
        var jwt_auth_result = this.jwt_auth_result;

        var opts = {};

        if (jwt_auth_result.size) {
            opts.size = jwt_auth_result.size
        }
        if (jwt_auth_result.ignoreChars) {
            opts.ignoreChars = jwt_auth_result.ignoreChars
        }

        var text = svgCaptcha.randomText(opts);

        var captcha = svgCaptcha(text);
        // console.log(text,captcha);

        return this.body = RES.SUCCESS({
            text: text,
            captcha: captcha
        });
    });


    router.get('/smsoutcb', function *() {
        console.log('this is cb - - -- - -- -- -- - -get', this.request.body, this.body);
        console.log(this.path);

        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    });

    router.post('/smsoutcb', function *() {
        console.log('this is cb - - -- - -- -- -- - -post', this.request.body, this.body);
        console.log(this.path);

        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    });


    router.get('/smsincb', function *() {
        console.log('this is cb - - -- - -- -- -- - -get', this.request.body, this.body);
        console.log(this.path);

        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    });

    router.post('/smsincb', function *() {
        console.log('this is cb - - -- - -- -- -- - -post', this.request.body, this.body);
        console.log(this.path);

        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    });
    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;