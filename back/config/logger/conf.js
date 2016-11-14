/**
 * Created by kevin on 16/8/10.
 */
const path = require('path');
let log = {
    dir: path.join(__dirname,'../..', 'logs'),
    categories:['router','model','controller'],
    format:'YYYY-MM-DD-[{category}][.log]'
};

let conf = {
    log: log
}

module.exports = conf;