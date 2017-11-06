var fs = require('fs');

var util = require('utils')

var casper = require('casper').create({
    clientScripts: ["lib/jquery.min.js"],
    proxy: "127.0.0.1:60380",
    // proxy: "http://proxy.abuyun.com:9020",
    // proxy:"112.35.45.141:8080",
    // 'proxy-auth': "H7A4R89161P4195D:D67A6F4DB1F79931",
    // 'proxy-type': "meh",
});
var $ = require('jQasper').create(casper)
casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.101 Safari/537.36');


var urls = [
    'https://lilicp69.tumblr.com/',
    'http://cutecatkrystal.tumblr.com/',
    'http://yourhuanghudsonus.tumblr.com/',
    'http://coser.686lm.com',
]

casper.start(urls[3]);


var count = 1

casper.then(function() {
    var self = this;
    this.echo('Page#'+count+' : ' + this.getTitle());
    var posts = $('.content-item')
    self.echo('Posts:'+posts)
    this.echo('Image Count:'+(this.getElementsAttribute('img', 'src').length))
    var imgs = this.getElementsAttribute('img', 'src');
    imgs.map(function(item){
        // self.download(item,'data/tumblr/'+item)
        self.echo('Download Success...Img:'+item)
    });
    // fs.writeFileSync('data/'+this.getTitle()+'.html',this.getHTML())
    self.download(self.getCurrentUrl(),'data/'+this.getTitle()+'.html')
    // this.capture('data/'+this.getTitle()+'_'+count+'.png');
    // this.echo(this.getPageContent())
});

// casper.thenOpen('http://www.chatshi.com', function() {
//     this.echo('Second Page: ' + this.getTitle());
//     this.capture(this.getTitle()+'.png')
// });
// phantom.clearCookies();
casper.run();