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
    





    router.post('/', function *(){
        console.log('this is cb',this.request.body);
        console.log(this.path);
        this.body = 'Home Page11';
    }); // responds to "/"

    router.get('/smstestsend', function *(){
        console.log('this is cb - - -- - -- -- -- - -get',this.request.body);
        console.log(this.path);
        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    }); // responds to "/"

    router.post('/smstestsend', function *(){
        console.log('this is cb - - -- - -- -- -- - -post',this.request.body, this.body);
        console.log(this.path);

        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    }); // responds to "/"

    router.get('/smstestcb', function *(){
        console.log('this is cb - - -- - -- -- -- - -get',this.request.body);
        console.log(this.path);
        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    }); // responds to "/"

    router.post('/smstestcb', function *(){
        console.log('this is cb - - -- - -- -- -- - -post',this.request.body);
        console.log(this.path);
        this.body = {
            "result": 0, //0表示成功，非0表示失败
            "errmsg": "" //result非0时的具体错误信息
        };
    }); // responds to "/"

    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;