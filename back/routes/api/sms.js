/**
 * Created by kevin on 16/8/10.
 */
var Router = require('koa-router');

function register (app) {
    var router = new Router({
        prefix: '/sms'
    });
    router.get('/id', function *(){

    });
    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;