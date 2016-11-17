## Welcom To GB SMS DOC!
   Below are some rules we followed. We use json.
   
1. 所有参数根据指定密钥加密成jwt,并且在传输的时候放置在Http Header、Cookies或者直接用post请求,键为"jwt_access_token"。

2. 服务器返回数据如下:
```
{
    "status": {          // status为服务器的返回状态,包括但不限于返回结果
        "code": -1,      // -1为失败 0为成功(遵循c语言标准)
        "httpcode": 100, // 自定义的http返回code
    },
    "data": {                   // data为返回数据,一般成功有返回需要数据       
        "uid": 1,               // 返回字段
        "role": "admin"     
    },
    "msg": "errMessage",    // 不论成功失败,后台提醒信息均为msg字段
    "paging": {              // 需要用到的分页数据
        "total": 20,         // total总数
        "page_size": 5,      // 页长
        "current_page": 2    // 当前页
    }
}
```
