let moment = require('moment'),
    fs = require('fs'),
    IM = require('immutable'),
    {exec,execSync} = require('child_process');
let Promise = require('bluebird');
let stat = {
    execCount:0,
    failCount:0,
    successCount:0,
    hour_stat:{},
}

let OPTIONS = {
    maxIp:1000,
    hoursIpRatio:[],
    maxConcurrent:10,
    avgHourIp:100
}
//常量
const STOP_TIME = moment().add(1,'d').valueOf()
const DAY_HOUR_COUNT = 24 //将一天分几分
const FROM_URL = 'http://www.baidu.com';
const START_URL = 'http://m.fukh5.cn';
console.log('停止时间戳:',STOP_TIME,'停止时间:',moment(STOP_TIME).format('YYYY-MM-DD HH:mm:ss'))
bin();


async function bin(){
    await _init_();
    await dispatch();
}

async function _init_(){
    //计算每小时的量,并监察系数
    let avgHourIp = OPTIONS.maxIp/DAY_HOUR_COUNT;
    OPTIONS.avgHourIp = avgHourIp;
    if(!OPTIONS.hoursIpRatio.length){
        OPTIONS.hoursIpRatio = new Array(DAY_HOUR_COUNT).fill(1)
    }else{
        _checkHoursIpRatio(OPTIONS.hoursIpRatio);
    }
    console.log('参数:',OPTIONS)
    return true;
}
async function _checkHoursIpRatio(){
    return true
}

async function dispatch(){
    while(new Date()<STOP_TIME && stat.successCount<OPTIONS.maxIp){ // 当天的循环
        let subStopTime = moment().add(1,'h').valueOf(),
            subFlag = moment().format('HH'),
            subMaxIp = OPTIONS.hoursIpRatio[parseInt(subFlag)-1] * OPTIONS.avgHourIp
        stat.hour_stat[subFlag] = Object.assign({},stat.hour_stat[subFlag],{execCount:0,failCount:0,successCount:0,})
        console.log('当前小时:',subFlag,'最大ip:',subMaxIp);
        while(new Date()<subStopTime && stat.hour_stat[subFlag].successCount<subMaxIp){  //小时的循环
            let tasks = []
            while(tasks.length<5){
                tasks.push(execOneAsync(subFlag))
            }
            await Promise.any(tasks);
            console.log('5个刷量任务结束.当前:',stat.hour_stat[subFlag],'\n总计:',stat);
        }
    }
}

async function execOneAsync(subFlag){
    return new Promise((resolve,reject)=>{
        stat.execCount++;
        stat.hour_stat[subFlag].execCount++;
        let cmd = 'casperjs shualiang.js  --pageCount=6';
        cmd += ' --from=' + FROM_URL;
        cmd += ' --start=' + START_URL;
        cmd+= ' --proxy=http://proxy.abuyun.com:9020'
        cmd+= ' --proxy-auth=H7A4R89161P4195D:D67A6F4DB1F79931'
        console.log('#',stat.execCount,'CMD:'+cmd)
        exec(cmd,function(error, stdout, stderr){
            if (error) {
                console.error(`exec error: ${error}`);
                stat.failCount++;
                stat.hour_stat[subFlag].failCount++;
                return resolve(error)
            }else{
                stat.successCount++;
                stat.hour_stat[subFlag].successCount++;
                // console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                return resolve(null)
            }       
        })
    })

    
}
