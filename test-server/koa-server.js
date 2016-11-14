/**
 * Created by kevin on 16/11/14.
 */
var koa = require('koa');
var jwt = require('koa-jwt');
var app = koa();
var moment = require('moment');
let serve = require('koa-static');
var path = require('path');
let bodyParser = require('koa-bodyparser');
var jwt = require('jsonwebtoken');
var jwt_verify = require('./lib/jwt_promise');
var url = require('url');

app.use(bodyParser());
var router = require('koa-router')();

router.get('/login', function *(next) {
    console.log('this is get login');
    this.body = {
        res: 'get login?'
    }
});
router.post('/login', function *(next) {
    console.log('this is post login', this.request.body);
    var dt = this.request.body;
    if(dt.id=='1'&&dt.name=='admin') {
        var secret = 'lalala';
        var parsed_url = url.parse(this.request.url, true);
        var before_token = (this.cookies.get('access_token') || this.request.body && this.request.body.access_token) || parsed_url.query.access_token || this.request.headers["x-access-token"];
        console.log('before: - - - - -', before_token);
        var expire_day = 1;
        var expires = moment().add(expire_day, 'days').toDate();
        console.log(expires);

        //如果存在token
        if(before_token) {
            var verify_result = yield jwt_verify.verify(before_token, secret).catch(function(err) {
                console.log('err',err);
                this.body = {
                    res: 'logined',
                    cookie: token,
                    data: verify_result,
                    status: {
                        code: 0
                    }
                }
            });
            console.log(verify_result, 'verify_rererereresult - -- - -- - -  -- -');

            this.body = {
                res: 'logined',
                cookie: token,
                data: verify_result,
                status: {
                    code: 1
                }
            }
        }
        //如果不存在token
        else {
            var token = jwt.sign({uid:1}, secret, {
                expiresIn : expire_day + 'd'
            })
            console.log('after: - - - - -', token);

            this.cookies.set('access_token', token, {
                expires: expires,
                domain: '.mysite.com'
            });
            this.body = {
                res: 'logined',
                cookie: token,
                status: {
                    code: 0
                }
            }
        }

    }else {
        this.body = {
            res: 'not logined',
            status: {
                code: -1
            }
        }
    }
});

app.use(router.routes())
    .use(router.allowedMethods());



app.use(serve(path.join(__dirname,'./static')));

app.listen(3001);