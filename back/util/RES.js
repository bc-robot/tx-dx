/**
 * Created by kevin on 16/11/17.
 */
function Response(data, msg, code, httpcode) {
    var obj = {
        "status": {          // status为服务器的返回状态,包括但不限于返回结果
            "code": "",      // -1为失败 0为成功(遵循c语言标准)
            "httpcode": "", // 自定义的http返回code
        },
        "data": "",               // data为返回数据,一般成功有返回需要数据
        // 不论成功失败,后台提醒信息均为msg字段
        // 返回字段
        // "paging": {                 // 需要用到的分页数据
        //     "total": 20,            // total总数
        //     "page_size": 10,        // 页长
        //     "current_page": 1       // 当前页
        // }
    }
    if(typeof arguments[0] == "string") {
        msg = arguments[0];
        data = {};
        httpcode = arguments[1]? arguments[1]: 0;
    }

    for(var arg in arguments) {
        if(arguments[arg] == 'paging') {
            obj.paging = arguments[arg]
        }
    }
    obj.status.code = code? code: 0;
    obj.status.httpcode = httpcode? httpcode: 200;
    obj.data = data? data: {};
    obj.msg = msg? msg: "";
    return obj;
}

function Success(data,msg,httpcode) {
    var obj = {
        "status": {          // status为服务器的返回状态,包括但不限于返回结果
            "code": "",      // -1为失败 0为成功(遵循c语言标准)
            "httpcode": "", // 自定义的http返回code
        },
        "data": "",               // data为返回数据,一般成功有返回需要数据
        // 不论成功失败,后台提醒信息均为msg字段
        // 返回字段
        // "paging": {                 // 需要用到的分页数据
        //     "total": 20,            // total总数
        //     "page_size": 10,        // 页长
        //     "current_page": 1       // 当前页
        // }
    }
    if(typeof arguments[0] == "string") {
        msg = arguments[0];
        data = {};
        httpcode = arguments[1]?arguments[1]: 0;
    }

    for(var arg in arguments) {
        if(arguments[arg] == 'paging') {
            obj.paging = arguments[arg]
        }
    }
    obj.status.code = 0;
    obj.status.httpcode = httpcode? httpcode: 200;
    obj.data = data? data: {};
    obj.msg = msg? msg: "";
    return obj;
}
function Error(data,msg,httpcode) {
    var obj = {
        "status": {          // status为服务器的返回状态,包括但不限于返回结果
            "code": "",      // -1为失败 0为成功(遵循c语言标准)
            "httpcode": "", // 自定义的http返回code
        },
        "data": "",               // data为返回数据,一般成功有返回需要数据
        // 不论成功失败,后台提醒信息均为msg字段
        // 返回字段
        // "paging": {                 // 需要用到的分页数据
        //     "total": 20,            // total总数
        //     "page_size": 10,        // 页长
        //     "current_page": 1       // 当前页
        // }
    }
    if(typeof arguments[0] == "string") {
        msg = arguments[0];
        data = {};
        httpcode = arguments[1]?arguments[1]: -1;
    }

    for(var arg in arguments) {
        if(arguments[arg] == 'paging') {
            obj.paging = arguments[arg]
        }
    }
    obj.status.code = -1;
    obj.status.httpcode = httpcode? httpcode: 500;
    obj.data = data? data: {};
    obj.msg = msg? msg: "";
    return obj;
}

exports.RESPONSE = Response;
exports.SUCCESS = Success;
exports.ERROR = Error;