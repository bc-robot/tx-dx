/**
 * Created by kevin on 16/11/14.
 */
var Promise = require('bluebird');
var jwt = require('jsonwebtoken');


exports.verify = function (before_token, secret) {
     return new Promise(function (resolve, reject) {
        jwt.verify(before_token, secret, function (err, decoded) {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

