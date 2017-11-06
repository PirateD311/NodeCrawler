let fs = require('fs'),
    cheerio = require('cheerio')

let html = fs.readFileSync('./static/tumblr.html'),
    $ = cheerio.load(html)

let imgs = $('img'),
    srcs = []
// console.log('图片数目->',$(imgs[1]).attr('src'));

for(let i=0;i<imgs.length;i++){
    srcs.push($(imgs[i]).attr('src'))
}
console.log('图片数目->',srcs);
fs.writeFileSync('./tumblr.json',JSON.stringify(srcs,null,2))

