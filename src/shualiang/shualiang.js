const rp = require('request-promise');
const urls = [
    // 'http://www.chatshi.com/app/#!/passYearData',
    // 'http://www.chatshi.com/app/#!/SchoolList',
    // 'http://www.chatshi.com/app/#!/MajorList',
    'http://dongminyuan.com.cn/',
    'http://dongminyuan.com.cn/?s=vod-read-id-1146.html',
    'http://dongminyuan.com.cn/?s=vod-read-id-1070.html',
]
// const url = 'http://www.chatshi.com/app/#!/passYearData';

async function getPage(url) {
    let opt = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.4; HTC D820u Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.89 Mobile Safari/537.36',
                'Upgrade-Insecure-Requests':'1',
                // 'Referer':'http://www.wmzy.com/api/school-score/bvp5la.html',
                // 'Host':'www.wmzy.com',
                // 'Cookie':'bdshare_firstime=1492484452207; guide=1; _gat=1; token=Z89T3JG_9VHtVNV6bvDpkNJk2ru4tZxg07rabLaIHi74bpor-t1F9Odmv_72Ke0ZqpY8oXbzZWOn4lPfbS6SZW==; sessionid=s:BzCrj4peI0KZpUHjhdqs92ud.NNCOjiZCYop7lj4KOZk24GhSpZZ3W9ervO4PRqhdCj8; Hm_lvt_02ceb62d85182f1a72db7d703affef9c=1493042176,1493292422,1493294463,1493464343; Hm_lpvt_02ceb62d85182f1a72db7d703affef9c=1493464689; _ga=GA1.2.1057113128.1491917036; Hm_lvt_8a2f2a00c5aff9efb919ee7af23b5366=1493042176,1493292422,1493294463,1493464343; Hm_lpvt_8a2f2a00c5aff9efb919ee7af23b5366=1493464704',
                'Accept-Encoding':'gzip, deflate, sdch',
                'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
                'Connection':'keep-alive',
                'Cache-Control':'no-cache',
                'Proxy-Connection':'keep-alive',
                //'Upgrade-Insecure-Requests':'1',
                'Pragma':'no-cache'
            },
            // localAddress:"139.196.113.98",
            gzip:true,
    }
    
    // 要访问的目标页面
    const targetUrl = url;

    // 代理服务器
    const proxyHost = "http-dyn.abuyun.com";
    const proxyPort = 9020;

    // 代理隧道验证信息
    const proxyUser = "H7A4R89161P4195D";
    const proxyPass = "D67A6F4DB1F79931";
    
    const proxyUrl = "http://" + proxyUser + ":" + proxyPass + "@" + proxyHost + ":" + proxyPort;

    const proxiedRequest = rp.defaults({'proxy': "http://116.199.115.78:80"});

    const options = Object.assign({},opt,{
      url     : 'http://139.196.113.98:8080/'||targetUrl
    });
    try{
        let resp = await proxiedRequest(options);
        console.log(url,'\t[请求成功]');
    }catch(err){
        console.error(url,'\t[请求失败!!!]');
        console.error(err)
    }
    
    
}

async function bin(urls,max=1){
    let count = 0;
    while(count++<max){
        await getPage(urls[count%urls.length])
        console.log('[当前请求数]:\t',count);
        await sleep(0.1);
    }
}
async function sleep(sec){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(sec);
        },sec *1000 )
    })
}
bin(urls)
