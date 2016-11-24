/**
 * Created by kevin on 16/8/10.
 */
//静态页面
let serve = require('koa-static');
//路由
// let router = require('koa-router');
//cors
let cors = require('koa-cors');
let bodyParser = require('koa-bodyparser');
let xmlParser = require('koa-xml-body').default;
let multer = require('koa-multer');


let jwt = require('koa-jwt');

var jwt_auth_mid = require('../middlewares/jwt-auth-mid');
var page_not_found = require('../middlewares/404');
// var jwt_auth = require('../routes/lib/jwt_auth');
// //视图模版
// let views = require('co-views');
// //session
// let session = require('koa-session');
//时间花费记录
const responseTime = require('../middlewares/x-response-time');
// //静态缓存文件
// let staticCache = require('koa-static-cache');
// //压缩服务
// let compress = require('koa-compress');
const onerror = require('koa-onerror');

// let koaBody = require('koa-body');



module.exports = function(app) {

    // app.use(function *(next){
    //     //config 注入中间件，方便调用配置信息
    //     if(!this.glob){
    //         this.glob = glob;
    //     }
    //     yield next;
    // });

    // app.use(function *(){
    //     console.log()
    // })

    // app.use(multer());
    // responseTime

    app.use(responseTime());
    app.use(serve(path.join(__dirname,'../../dist')));



    app.use(cors(
        {
            credentials: true
        }
        ));
    app.use(xmlParser());
    app.use(bodyParser());

    // app.use(page_not_found());
    // jwt验证
    app.use(jwt_auth_mid());

    // app.use(compress());
    // app.keys = ['session'];
    // app.use(session(app));
    // onerror(app);
}