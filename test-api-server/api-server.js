/**
 * Created by kevin on 16/11/14.
 */
var koa = require('koa');
var jwt = require('koa-jwt');
var app = koa();
var moment = require('moment');
let serve = require('koa-static');
var path = require('path');


app.use(function *(next){
    if(this.cookies) {
        console.log('in cookie...')
        console.log(this.cookies.get('access_token'));
    }
    yield next;
});

var bodyParser = require('koa-bodyparser');
app.use(bodyParser());

var router = require('koa-router')();

router.get('/login', function *(next) {
    console.log('this is get login');
    console.log(this.cookies.get('access_token'));
    this.body = {
        res: 'get login1?'
    }
});

app.use(router.routes())
    .use(router.allowedMethods());

app.use(serve(path.join(__dirname,'./static')));

app.listen(3000);