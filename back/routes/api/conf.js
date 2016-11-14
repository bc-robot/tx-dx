/**
 * Created by kevin on 16/8/10.
 */
var Router = require('koa-router');
var debug = require('debug')('book');

function register (app) {
    var router = new Router({
        prefix: '/config'
    });
    router.get('/', function(){
        var config = this.config;
        debug('env:%s',config.env);
        this.body = config;
    }); // responds to "/api"
    app.use(router.routes());
    app.use(router.allowedMethods());
}

module.exports = register;