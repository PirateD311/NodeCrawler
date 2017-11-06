const proxyHost = "http-dyn.abuyun.com";
const proxyPort = 9020;
var images = []
var fs = require('fs')
// 代理隧道验证信息
const proxyUser = "H7A4R89161P4195D";
const proxyPass = "D67A6F4DB1F79931";
var xuniIp = '116.199.115.78'
var page = require('webpage').create();
// page.setProxy("http://"+proxyUser+":"+proxyPass+"@"+proxyHost+":"+proxyPort+"/?");
page.setProxy("http://127.0.0.1:60380");
page.settings.userAgent = 'Mozilla/3.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36';
page.settings.cookies='rxx=16kwdlhvq5d.u7xurd6&v=1; tmgioct=59a7d38c3f96740861976270; logged_in=1; language=%2Czh_CN; __gads=ID=788c99ec0fdc7339:T=1506086009:S=ALNI_MZpOV9l9R8ZCcJOnDeOOl3Ns88REg; pfx=350812ff0db96ddf39114ba6a9826d623c5233bd5c49913f450e0bc103a16338%230%232724488404; __utma=189990958.1695907161.1504170796.1509457403.1509461208.77; __utmc=189990958; __utmz=189990958.1509437983.75.20.utmcsr=hatsuneyuko.tumblr.com|utmccn=(referral)|utmcmd=referral|utmcct=/post/147544362031/expose1933; _ga=GA1.2.1695907161.1504170796; _gid=GA1.2.816984821.1509348100'
phantom.page.customHeaders = {
    "X-Forwarded-For" : xuniIp ,
    "Client_Ip":xuniIp,
    "VIA":xuniIp,
    "Remote_Addr": xuniIp,
}
// console.log('Page Require OK...');
const urls = [
    'http://139.196.113.98:8080/sitemap/getList',
    'http://yourhuanghudsonus.tumblr.com/',
    'https://hatsuneyuko.tumblr.com/post/147544362031/expose1933',
    // 'https://www.tumblr.com/dashboard?referring_blog=hatsuneyuko&referer=optica',
    // 'http://dongminyuan.com.cn/',
    'http://wx.chateacher.com/pages/BigWheel.html',
    'http://www.chatshi.com/app/#!/passYearData',
    'http://www.chatshi.com/app/#!/SchoolList',
    'http://www.chatshi.com/app/#!/MajorList',
];



// console.log('Begin....')
page.open(urls[0], function (status) {

    // console.log('Request Ok...')
    console.log("[Status:] " + status);
    if (status === "success") {
        page.render('ex2.png');
    }
    // console.log('Content:',page.content)
    console.log('Image Lenght:',images.length)
    console.log('[Images:\n]',JSON.stringify(images,null,2));
    // fs.writeFileSync('/Users/liuxun/workspace/NodeCrawler/src/shualiang/imageUrls.json',JSON.stringify(images,null,2))
    phantom.exit();
    console.log('[Exit Success!]');
    

});
page.onConsoleMessage = function(msg) {
  console.log('[Console:]' + msg);
};
page.onResourceRequested = function(request) {
//   console.log('[Request:]' + JSON.stringify(request, null, 2));
    // console.log('[Request]',response.status,'[Url]' , response.url);
};
page.onResourceReceived = function(response) {
//   console.log('[Received]' + JSON.stringify(response, null, 2));
  console.log('[Received]',response.status,'[Url]' , response.url);
  if(response.url.lastIndexOf('.jpg')===(response.url.length-4) || response.url.lastIndexOf('.png')===(response.url.length-4) ){
    if(response.url.indexOf('avatar')>0)return
    images.push(response.url)
  }
//   images.push(response.url)
};

setTimeout(function(){
    console.log('请求超时。。。');
    phantom.exit();
    console.log('[Exit Error:请求超时!]')
},100000 )
