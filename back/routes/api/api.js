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
var gb_secrets = require('../../../../gb-secrets/gb-dx');

function register (app) {
    var router = new Router({
        prefix: '/api'
    });
    router.get('/send', function *(){

        this.body = 'getout of here';
    });
    router.post('/send', function *(){
        console.log(this.request.body, 'this is request');

        console.log(gb_secrets);
        var jwt_secret = gb_secrets.jwt_secret;
        var strAppkey = gb_secrets.strAppkey;

        console.log(jwt_secret, strAppkey, 'adfasfasdfs')

        //  jwt认证
        var catch_err;

        var jwt_auth_result = yield jwt_auth(this,jwt_secret).catch(function(err) {
            console.log(err);
            catch_err = err
        });

        if(!jwt_auth_result) {
            console.log('ininn')
            return this.body = {
                err: catch_err
            }
        }

        console.log(jwt_auth_result, 'this is jwt_auth_result');

        var headers = {
            'Content-Type': 'application/json'
        };
        var strPhone = jwt_auth_result.tel;


        // var sig = crypto.createHash('md5').update((strAppkey+strPhone).toString()).digest('hex');
        var appPhone = strAppkey+strPhone;
        var sig = md5(appPhone);

        console.log(sig, 'this is sig');

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
            "ext": "yonghusession" //可选字段，不需要就填空。用户的session内容，腾讯server回包中会原样返回
        }
        console.log(msg, 'this is msmsmsmsmsmsmssmmsmsmsmsmsmsmg')

        var random = mu.generateNonceString();

        console.log(random, 'this is random');

        var options = {
            url: 'https://yun.tim.qq.com/v3/tlssmssvr/sendsms?sdkappid=1400018008&random='+random,
            method: 'POST',
            headers: headers,
            json: msg
        }

        let result = yield request(options);
        let body = result.body;
        console.log('Body: ', body);
        this.set('content-type', 'application/json');
        this.body = body;
    });



    router.get('/smsoutcb', function *(){
        console.log('this is cb - - -- - -- -- -- - -post',this.request.body, this.body);
        console.log(this.path);

        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    });

    router.get('/smsincb', function *(){
        console.log('this is cb - - -- - -- -- -- - -post',this.request.body, this.body);
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