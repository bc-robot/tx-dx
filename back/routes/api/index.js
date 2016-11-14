/**
 * Created by kevin on 16/8/10.
 */
var Router = require('koa-router');
var crypto = require('crypto');
var request = require('co-request');
var md5 = require('MD5');
var mu = require('../lib/myUtil');


function register (app) {
    var router = new Router();

    router.get('/', function *(){
        this.body = 'Home Page';
    }); // responds to "/"


    router.get('/sendmsg', function *(){

        var headers = {
            'Content-Type': 'application/json'
        };

        var phone = "15150121121";
        var strPhone = phone;
        var strAppkey = 'e75ff271d9a7023f4a026f289e498c88';
        // var sig = crypto.createHash('md5').update(strAppkey + strPhone).digest('hex');
        var appPhone = strAppkey+strPhone;
        var sig = md5(appPhone);
        console.log(sig, 'this is sig');

        var msg = {
            "tel": {
                "nationcode": "86", //国家码
                "phone": phone //手机号码
            },
            "type": "0", //0:普通短信;1:营销短信（强调：要按需填值，不然会影响到业务的正常使用）
            // "sign": "腾讯云", //短信签名，如果使用默认签名，则可以缺省此字段
            "tpl_id": 4243, //业务在控制台审核通过的模板ID
            //假定这个模板为：您的{1}是{2}，请于{3}分钟内填写。如非本人操作，请忽略本短信。
            "params": ["验证码", "1234"], //参数列表，将依次替换模板中的参数
            "sig": sig, //app凭证，具体计算方式见下注
            "extend": "", //可选字段，默认没有开通(需要填空)。通道扩展码，
            //在短信回复场景中，腾讯server会原样返回，开发者可依此区分是哪种类型的回复
            "ext": "yonghusession" //可选字段，不需要就填空。用户的session内容，腾讯server回包中会原样返回
        }

        var random = mu.generateNonceString;
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
        this.body = result.body;

    }); // responds to "/"





    router.post('/', function *(){
        console.log('this is cb',this.request.body);
        console.log(this.path);
        this.body = 'Home Page11';
    }); // responds to "/"

    router.get('/smstestsend', function *(){
        console.log('this is cb',this.request.body);
        console.log(this.path);
        this.body = 'Home Page';
    }); // responds to "/"

    router.post('/smstestsend', function *(){
        console.log('this is cb',this.request.body);
        console.log(this.path);
        this.body = 'Home Page11';
    }); // responds to "/"

    router.get('/smstestcb', function *(){
        console.log('this is cb',this.request.body);
        console.log(this.path);
        this.body = 'Home Page';
    }); // responds to "/"

    router.post('/smstestcb', function *(){
        console.log('this is cb',this.request.body);
        console.log(this.path);
        this.body = 'Home Page11';
    }); // responds to "/"

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;