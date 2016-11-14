/**
 * Created by kevin on 16/11/14.
 */
var url = require('url')
var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken');

module.exports = function(_this){

    // Parse the URL, we might need this
    var parsed_url = url.parse(req.url, true)

    /**
     * Take the token from:
     *
     *  - the POST value access_token
     *  - the GET parameter access_token
     *  - the x-access-token header
     *    ...in that order.
     */
    var token = (_this.request.body && _this.request.body.access_token) || parsed_url.query.access_token || this.request.headers["x-access-token"];
    if (token) {
        try {
            jwt.verify(before_token, 'lalala', function(err, decoded) {
                if(err) {
                    console.log(err, '-|-|-|-|_|-|-|-|-');
                }else {
                    console.log(decoded, '-|-|-|-|_|-|-|-|-');
                }
            });
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'))

            if (decoded.exp <= Date.now()) {
                res.end('Access token has expired', 400)
            }

            UserModel.findOne({ '_id': decoded.iss }, function(err, user){

                if (!err) {
                    req.user = user
                    return next()
                }
            })

        } catch (err) {
            return next()
        }

    } else {

        next()

    }
}