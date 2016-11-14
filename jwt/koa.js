/**
 * Created by kevin on 16/11/12.
 */
var koa = require('koa');
var jwt = require('koa-jwt');
var app = koa();
var moment = require('moment');

// app.use(require('koa-session')(app));

// Custom 401 handling if you don't want to expose koa-jwt errors to users
// app.use(function *(next){
//     try {
//         yield next;
//     } catch (err) {
//         if (401 == err.status) {
//             this.status = 401;
//             this.body = 'Protected resource, use Authorization header to get access\n';
//         } else {
//             throw err;
//         }
//     }
// });


// Unprotected middleware
app.use(function *(next){
    console.log('here');
    var expires = moment().add(10, 'seconds').toDate();
    console.log(expires);
    console.log(this.cookies.get('access_token'));
    this.cookies.set('access_token','bbheheheda', {
        expires: expires,
        domain: '.mysite.com'
    });
    // this.cookies.set('access_token1','bbhehehedawww', {
    //     domain: 'www.mysite.com'
    // });
    // if (this.url.match(/^\/public/)) {
    //     console.log(this.request.headers);
    //     this.body = 'unprotected\n';
    // } else {
    //     yield next;
    // }
});

// Middleware below this line is only reached if JWT token is valid
// app.use(jwt({ secret: 'shared-secret' }));
//
// // Protected middleware
// app.use(function *(){
//     if (this.url.match(/^\/api/)) {
//         this.body = 'protected\n';
//     }
// });

app.listen(3000);