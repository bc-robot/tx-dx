/**
 * Created by kevin on 16/11/17.
 */

var jwt = require('jsonwebtoken');
var Promise = require('bluebird');


var gb_secrets = require('../../../gb-secrets/gb-dx');
var jwt_auth = require('../routes/lib/jwt_auth');
var jwt_secret = gb_secrets.jwt_secret;
var strAppkey = gb_secrets.strAppkey;


module.exports = jwtAuthMid;

function jwtAuthMid() {
    return function *jwtAuthMid(next){
        if(this.path.indexOf('test') >=0) {
            yield *next;
        }else {
            var error_msg = '';
            var jwt_auth_result = '';
            yield jwt_auth(this,jwt_secret)
            .then(function(val) {
                // console.log(val, 'set jwt token!!!');
                jwt_auth_result = val;
            }).catch(function(err){
                error_msg = err;
            });
            if(jwt_auth_result){
                // console.log(jwt_auth_result, 'this is middleware<<<<<<');
                this.jwt_auth_result = jwt_auth_result;
                yield *next;
            } else if(error_msg) {
                // return this.body = {
                //     status: {
                //         code: -1,
                //         httpcode: ''
                //     },
                //     data: {
                //         msg: error_msg
                //     }
                // }

                return this.body = RES.ERROR(error_msg, '验证出错');
            }
        }
    }
}