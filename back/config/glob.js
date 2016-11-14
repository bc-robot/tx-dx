/**
 * Created by kevin on 16/8/10.
 */
const conf = require('./logger/conf');
let path = require('path');
//日志记录
const logger = require('mini-logger');
//moment时间
const moment = require('moment');
let _ = require('lodash');

let log = logger(conf.log);
global.log = log;
// console.log('global-log');
global.path = path;
// console.log('global-path');
global.moment = moment;
global._ = _;

module.exports = {
    log: log,
    path: path,
    moment: moment,
    _: _
}