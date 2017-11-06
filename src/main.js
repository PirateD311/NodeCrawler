/**
 * Created by liuxun on 17/3/21.
 */
var cheerio = require('cheerio'),
    fs = require('fs'),
    request = require('request'),
    Promise = require('bluebird')


const uzyReqOptions = {
    options:{
        //url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            'Upgrade-Insecure-Requests':'1',
            'Referer':'http://www.youzy.cn/college/pfraction?Id=838&provinceId=undefined&courseType=-1&codeId=33_838_0_0&year=2013',
            'Host':'www.youzy.cn',
            'Cookie':'gr_user_id=5c086b0d-a957-445c-9f98-156c7a6c6429; UM_distinctid=15c3a2c512dbb7-02c83fcb01c958-30657509-1fa400-15c3a2c512e704; Youzy.FirstSelectVersion=1; ASP.NET_SessionId=5nz24y2azyw0cjaw0jgll5qk; SERVER_ID=129da756-9eca6ad3; Youzy.CurrentVersion=%7b%22Name%22%3a%22%e6%b9%96%e5%8d%97%22%2c%22EnName%22%3a%22hunan%22%2c%22ProvinceId%22%3a850%2c%22Domain%22%3a%22http%3a%2f%2fhunan.youzy.cn%22%2c%22Description%22%3a%22%22%2c%22QQGroup%22%3a%22343855494%22%2c%22QQGroupUrl%22%3anull%2c%22IsOpen%22%3atrue%2c%22Sort%22%3a13%2c%22Province%22%3a%7b%22Name%22%3a%22%e6%b9%96%e5%8d%97%22%2c%22Id%22%3a850%7d%2c%22Id%22%3a12%7d; Uzy.AUTH=AE0C95397D39ACA3A641104993AD873761BD714B6FD1595C178A12D29ACAB5B9774C142C06C4B13AD9BB228CD93F995752DF2847D4ABD393CACD775B853EFC016B8C72601C79178FC69B9937B5066D624FB6C3C3DCFBB25CE921F4E0553DEA7EFB581AD81B0063951B210F03B11B01995B6AAB23; gr_session_id_943f0f1daad3348b=a66a0fbd-4c25-4b09-925d-514972146fde; CNZZDATA1254568697=1246575260-1495622105-null%7C1497832180; Hm_lvt_12d15b68f4801f6d65dceb17ee817e26=1497516056,1497516800,1497592950,1497803121; Hm_lpvt_12d15b68f4801f6d65dceb17ee817e26=1497836091',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
            'Connection':'keep-alive',
            'Cache-Control':'no-cache',
            'Proxy-Connection':'keep-alive',
            //'Upgrade-Insecure-Requests':'1',
            'Pragma':'no-cache'
        },
        gzip:true,
    }
}



var urlLists = [],
    years = ['2016'],
    schLists = require('./UzySchList.json').schools;
    //baseUrl = 'http://www.youzy.cn/college/pfraction?Id=838&provinceId=undefined&courseType=-1&codeId=33_838_0_0&year=2012'


class UrlManager {
    constructor(){
        this.UrlBox = [];
        this.current = 0;
    }

    addUrl(url,tag){
        this.UrlBox.push({url:url,tag:tag||{}});
        return this.UrlBox;
    }
    autoGenUrlByParam(years,province,schs){
        for(let p of province){
            if(['11','12','13','14','15','21','22','23','31','32','33','34','35','36','37','41'].indexOf(p)!=-1){
                console.log('已经完成的省份');
                continue;
            }
            for(var y of years){
                for(var sch of schs){
                    let tmpUrl = 'http://www.youzy.cn/college/pfraction?Id='+sch.code+'&provinceId=undefined&courseType=-1&codeId='+p+'_'+sch.code+'_0_0&year='+y,
                        tag = {
                            sch_name:sch.sch_name,
                            province:p,
                            sch_code:sch.code,
                            year:y
                        }
                    this.UrlBox.push({url:tmpUrl,tag:tag});
                }
            }
        }
        return this.UrlBox.length;
    }
    next(){
        return this.UrlBox[this.current++]
    }
    hasNext(){
        if(this.current>=this.UrlBox.length)return false;
        else return true;
    }
    stat(){
        console.log('总Url数->%d,已完成->%d,剩余->%d',this.UrlBox.length,this.current,this.UrlBox.length - this.current);
    }
}


class RequestManager{
    constructor(defaultOpt){
        this.opt = defaultOpt||{};
        this.request = require('request-promise');
    }

    async get(url){
        try {
            let option = Object.assign({},this.opt,{url:url});
            //console.log(option);
            let resp = await this.request(option);
            return resp;
        } catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }
}

class PageHandler{
    constructor(){
        this.count = 0;
        this.cheerio = require('cheerio');
    }


    handleSchLiNianResult(strHtml,tag){

        let $ = this.cheerio.load(strHtml);
        let html = $('.table-th-gray').html(),
            majorCount = 0;
        console.log('tr 共计:'+$('tr').length);
        let DataRows = [];
        $('tr').each(function(i,e){

            if(i>1){
                var item = {};
                item.year = trim($($(e).children()[0]).text());
                item.province = tag.province;
                item.sch_name = trim($('.college-head a').attr('title'));
                item.major_name = trim($($(e).children()[1]).text());
                if(item.major_name.search(/(\r\n)|(\n)/g)>0){
                    item.major_name = item.major_name.substring(0,item.major_name.search(/(\r\n)|(\n)/g));
                }

                item.batch = trim($($(e).children()[2]).text());
                item.max_score = trim($($(e).children()[3]).text());
                item.low_score = trim($($(e).children()[4]).text());
                item.avg_score = trim($($(e).children()[5]).text());
                item.enroll_num = trim($($(e).children()[6]).text());
                item.min_rank = trim($($(e).children()[7]).text());

                if(item.major_name){
                    majorCount ++;
                    DataRows.push(item);
                }

            }
        });
        console.log(trim($('.college-head a').attr('title'))+',省份:'+tag.province+'爬取完毕,专业共计:'+majorCount);
        return DataRows;
    }
}

class DataHandler{
    constructor(){
        this.tmpDb = [];
        this.num = 0;
    }

    saveOne(item){
        this.tmpDb.push(item);
        return this.tmpDb;
    }
    saveList(listItem){
        this.tmpDb = this.tmpDb.concat(listItem);
        return this.tmpDb;
    }
    count(){
        return this.tmpDb.length;
    }
    writeToJson(fileName,path){
        let tmpPath = (path||'') + fileName;
        fs.writeFileSync(tmpPath,JSON.stringify({data:this.tmpDb},null,2));
        return true;
    }
}

async function main(){
    let urlHandler = new UrlManager(),
        requestHandler = new RequestManager(uzyReqOptions.options),
        pageHandler = new PageHandler(),
        dbHandler = new DataHandler()

    const Years = ['2016'];
    const SchLists = require('./UzySchList.json').schools
    const CONFIG = require('../crawler/config.js')
    let PROVINCES = Object.keys(CONFIG.province_short);

    urlHandler.autoGenUrlByParam(Years,PROVINCES,SchLists);
    urlHandler.stat();

    let goOn = true;
    while(goOn && urlHandler.hasNext()){
        //if(urlHandler.current<=40)continue;
        let url = urlHandler.next();
        let resp = await requestHandler.get(url.url);
        //fs.writeFileSync('tmpSchHtml.html',resp);
        //console.log(resp);
        let data = pageHandler.handleSchLiNianResult(resp,url.tag);
        if(data.length>0){
            dbHandler.saveList(data);
            dbHandler.writeToJson([url.tag.year,url.tag.province,'uzy'].join('_')+'.json','2016/');
        }
        if(urlHandler.current % 10 == 0){
            fs.writeFileSync('CrawlerLog.log',urlHandler.current);
        }
        //goOn = false;
    }
    urlHandler.stat();
}

main();

function trim(str){
    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
}




