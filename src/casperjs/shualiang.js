//刷量常用配置
const FROM = ''  //流量来源
const START_URL = '';                //初始目标URL
const PAGE_COUNT = 3;                //单次浏览多少个页面
const PV_PAGE_TIME = 10              //单页面停留时间
const AIM_URLS = []                  //目标URL
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'                //浏览器类型

var OPTIONS = {
    from:'',
    start:'',
    pageCount:3,
    pageTime:5,
    pageTimeFloat:[0.8,1.2],
    userAgent:USER_AGENT,

    count:0    
};

var fs = require('fs');
var util = require('utils');
var casper = require('casper').create({
    clientScripts: ["lib/jquery.min.js"],
    verbose:true,
    // logLevel: "debug",
    // proxy: "127.0.0.1:60380",
    // proxy: "http://proxy.abuyun.com:9020",
    // proxy:"http://116.199.115.78:80",
    'proxy-auth': "H7A4R89161P4195D:D67A6F4DB1F79931",
    'proxy-type': "meh",
    pageSettings: {
        loadImages:  false,		// The WebPage instance used by Casper will
        // loadPlugins: false,		 // use these settings
        userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",

    }, 
    onResourceRequested:function(ca,req){
        // console.log('Req:',JSON.stringify(req,null,2));
    }
});
var $ = require('jQasper').create(casper)
var x = require('casper').selectXPath;
function _init_(){
    const Parameters = ['from','start','pageCount','pageTime','userAgent','randomUA']
    for(var i in Parameters){
        var p = Parameters[i]
        if(casper.cli.has(p)){
            OPTIONS[p] = casper.cli.get(p)
            console.log('加载操作配置:',p,OPTIONS[p])
        }
    }
    // console.log('本次配置信息:',JSON.stringify(OPTIONS,null,4));

    if(OPTIONS.from)OPTIONS.from = _formatUrl(OPTIONS.from)
    if(OPTIONS.start)OPTIONS.start = _formatUrl(OPTIONS.start)

    //设置UserAgent
    if(OPTIONS.userAgent){
        casper.options.pageSettings.userAgent = OPTIONS.userAgent;
    }
    if(OPTIONS.randomUA){
        casper.options.pageSettings.userAgent = _getRandomUserAgent();
    }
    // console.log('Casper Options:',JSON.stringify(casper.options,null,4))
    //设置请求头
    casper.on('started', function () {
        this.echo('设置自定义请求头')
        this.page.customHeaders = { 
            Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            // 'Accept-Encoding': 'gzip, deflate' ,
            'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
            'Cache-Control':'no-cache',
            // 'Host':'coser.686lm.com',
            'Proxy-Connection':'keep-alive',
            Referer:OPTIONS.from||'https://www.baidu.com',
            'Upgrade-Insecure-Requests':'1',
        }
        this.echo('流量来源:'+OPTIONS.from)
    });
}
function _getRandomUserAgent(){
    const PC_RATIO = 0.001;
    var userAgentPc = [
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',//Safari Mac
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0',//ie 9
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',//chrome,
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)',//360

    ]
    var userAgentMb = [
        'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
        // 'Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
        'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
        // 'NOKIA5700/ UCWEB7.0.2.37/28/999',
    ]
    if(Math.random()<PC_RATIO){ // PC端的
        return _getRandomItem(userAgentPc);
    }else{
        return _getRandomItem(userAgentMb);
    }
}
function _formatUrl(url){
    console.log(url)
    if(url.indexOf('http://')===0 || url.indexOf('https://')===0)return url;
    else return ('http://'+url)
}
function _getRandomItem(arr){
    var randomIdx = Math.ceil(Math.random() * (arr.length-1))
    return arr[randomIdx]
}
function _getPageWaitTime(){
    return OPTIONS.pageTime * (OPTIONS.pageTimeFloat[0]+Math.random()*(OPTIONS.pageTimeFloat[1]-OPTIONS.pageTimeFloat[0]))
}
_init_()
//从目标地址开始
casper.start(OPTIONS.from);
casper.then(function(){
    var self = this,
        randomId = String(parseInt(new Date().getTime() / parseInt((5+Math.random()))))
    this.echo('来源['+this.getTitle()+']地址:'+this.getCurrentUrl());
    var nextUrl = '<a id="'+randomId+'" href="'+OPTIONS.start+'">'+randomId+'</a>'
    $('body').append(nextUrl)
    self.echo('Next a:'+$('#'+randomId).html())
    $('#'+randomId).click();
    // casper.open(OPTIONS.start)
})

_handlePages();
function _handlePages(){
    //首页
    casper.then(randomClickA)
}

function randomClickA(resp){
        // this.capture('./data/Before'+'_Click.png')
        OPTIONS.count++;
        var self = this;
        this.echo(OPTIONS.count+'Page'+' : ' + this.getTitle() +',Url:'+this.getCurrentUrl());
        var waitTime = _getPageWaitTime()
        this.wait(waitTime*1000,function(){
            this.echo('等待'+waitTime+' s');
            if(OPTIONS.count>OPTIONS.pageCount){
                this.echo('已达到最大访问页数要求')
            }else{
                // if(false){
                //     this.click('a.link'); 
                //     casper.then(function(){
                //         this.capture('./data/'+OPTIONS.count+'_Click.png')
                //     })
                //     return
                // }
                
                var allUrls = this.getElementsAttribute('a','href');
                this.echo('a链接个数:'+allUrls.length);
                var nextA = '',count=0
                while(!nextA && count++<allUrls.length){
                    var randomUrl = _getRandomItem(allUrls);
                    this.echo('随机链接的Url:'+randomUrl)
                    if(randomUrl){
                        if(randomUrl.indexOf('#!/')===0||
                            randomUrl.indexOf('/')===0 || 
                            randomUrl.indexOf(OPTIONS.start)===0){
                            this.echo('随机链接为内链')
                            var tmpA = this.getElementInfo(x('//a[@href="'+randomUrl+'"]'))
                            if(this.exists(x('//a[@href="'+randomUrl+'"]')) &&
                                tmpA.x>0&&tmpA.y>0&&tmpA.height>0&&tmpA.width>0){
                                util.dump(tmpA)
                                nextA = x('//a[@href="'+randomUrl+'"]');
                            }                       
                        }else{
                            this.echo('随机链接为外链')
                        }
                    }else{
                        this.echo('空的链接')
                    }
                }
                casper.thenClick(nextA,randomClickA)
            }
            if(this.getTitle()){
                // this.capture('./data/'+this.getTitle()+'_'+'.png')
            }
        })



}

phantom.clearCookies();
casper.run();