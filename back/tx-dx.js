/**
 * Created by kevin on 16/8/10.
 */
const koa = require('koa');
const path = require('path');

let app = koa();

let glob = require('./config/glob');

//注入koa
require('./config/koa')(app);
//注入路由
require('./routes')(app);

const port = process.env.PORT || 4003;

console.log('app location: ' + __filename);
console.log('started on port: ' + port);
console.log('at ' + moment().format('YYYY-MM-DD HH:mm:ss'));

app.listen(port);
module.exports = app;