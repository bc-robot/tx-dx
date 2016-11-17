/**
 * Created by kevin on 16/11/14.
 */
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');

function authJwt(ctx,secret) {
    return new Promise(function(resolve, reject) {
        var jwt_access_token = (ctx.cookies && ctx.cookies.get('jwt_access_token') || ctx.request.body && ctx.request.body.jwt_access_token) || ctx.request.headers["jwt-access-token"];
        if (jwt_access_token) {
            try {
                jwt.verify(jwt_access_token, secret, function(err, decoded) {
                    if (err) {
                        reject(err);
                    } else {
                        // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用
                        // console.log(decoded ,Date.now());
                        if (decoded.exp >= Date.now()) {
                            // reject({ code: 0, message: 'Access token has expired' });
                            resolve(Object.assign({},ctx.request.body,decoded));
                        }else {
                            reject("jwt过期")
                        }
                    }
                });
            } catch (err) {
                reject(err)
            }
        }else {
            reject("no jwt");
        }
    });
}

module.exports = authJwt;