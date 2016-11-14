/**
 * Created by kevin on 16/8/10.
 */
// const fs = require('co-fs');
const fs = require('fs');

function register(app){
    var dirname = 'api';
    console.log(__dirname+'/'+dirname);
    fs.readdir(__dirname+'/'+dirname,function(err,files){
        if(err){
            console.log('read dir error');
            log.router('read dir error');
        }else{
            files.forEach(function(item){
                //console.log('./'+dirname+'/'+item);
                require('./'+dirname+'/'+item)(app);
                //console.log(item,' required!');
            });
        }
    });

    //var files = paths.map(function(path){
    //    return fs.readFile('routes/api/' + path, 'utf8');
    //});
    //
    //this.type = 'markdown';
    //this.body = files.join('');
    //require('./api/foo')(app);
    //require('./api/bar')(app);
}

module.exports = register;