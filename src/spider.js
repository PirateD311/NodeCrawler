'use strict'
module.exports = 
	class Spider{
		constructor(){
			console.log('Spider constructor Begin');
			this.cheerio = require('cheerio');
			this.rq = require('request-promise');
			this.fs = require('fs')

			this.count = 0;
			this.url_list = [];
			this.current = {
				index:0,
				url:''
			}

			this.default_req_opt = {
				gzip:true,
			};
			this.default_opt = {
				retryCount:0, //请求失败最大重试次数
				fail_wait:0.5, //请求失败sleep时间，单位
				success_wait:0,//请求成功sleep时间，单位s
			};

			// this.test = function(){
			// 	console.log('Spider Test....');
			// }
			this.test = this.test;
			console.log('Spider constructor Done');
		}

		 _log(info){
			console.log(info);
		}

		async _sleep(sec){
			setTimeout(()=>{
				return Promise.resolve();
			},sec*1000);
		}

		test(){
			console.log('Im ok...');
		}

		async request(url,option){
			//url请求的函数
			if(!url)throw '请携带正确的Url';
			let req_opt = Object.assign({},this.default_req_opt)
			console.log(typeof url)

			if(typeof url === 'string')req_opt.url = url;
			if(typeof url === 'object')req_opt = Object.assign(req_opt,url);

			let opt = Object.assign({},this.default_opt,option);
			let retryCount = opt.retryCount||1,
				resp;

			console.log(req_opt);
			do{
				try{
					console.log(req_opt);
					resp = await this.rq(req_opt);
					retryCount = 0;
				}catch(e){
					this._log(e);
					retryCount--;
					await this._sleep(opt.fail_wait||0);
				}
			}while(retryCount>0);
			await this._sleep(opt.success_wait||0);
			return resp;
		}

		async downloadImg(src){
			let img = await this.rq({url:src,encoding: 'binary'});
			this.fs.writeFileSync('imgs/'+src,img,'binary')
		}

		parse(resp,type){
			//做请求相应的解析逻辑
			type = type||'html';
			switch(type){
				case 'html':let $ = this.cheerio.load(resp);return $;;
				case 'json':let obj = JSON.parse(resp);return obj;
				default:let $2 = this.cheerio.load(resp);return $2;;
			}
		}

		handleHtml($){
			//做页面的数据解析提取逻辑
			let data = {};
			return data;
		}

		async handleData(data){
			//做数据的存储逻辑
		}

		async work(task,option){
			try{
				let resp = await this.request(task.url);
				let data = this.handleHtml(this.parse(resp));
				
			}catch(error){

			}
		}


	}


// class myTestSpider extends Spider{
// 	constructor(){
// 		super();
// 	}
// }

// var mySpider = new myTestSpider();
// downloadImg('https://78.media.tumblr.com/54fbb590820dd5fdfe1160be9891eb49/tumblr_oyd7a8YLtI1ug4tgwo6_540.jpg')

'https://ggeuc.tumblr.com/video_file/t:ptlQM_mcUym2Xg7TLJ2ufA/166775509953/tumblr_owkhj5Rrcz1vv1jaj'
// downVideo('https://ggeuc.tumblr.com/video_file/t:ptlQM_mcUym2Xg7TLJ2ufA/166775509953/tumblr_owkhj5Rrcz1vv1jaj')
//图片下载
async function downloadImg(src,i){
	let rq = require('request-promise'),
		fs = require('fs'),
		opt = {
			url:src,
			encoding:'binary',
			// host:'127.0.0.1',
			// port:'60380'
		},
		proxyUrl = "http://127.0.0.1:60380",
		proxyRq = rq.defaults({'proxy': proxyUrl});

		let img = await proxyRq(opt);
		fs.writeFileSync('./static/imgs/LuYeXi/'+i+'.png',img,'binary');
		console.log('Ok。。#',i)
}

async function downVideo(src){
	let rq = require('request-promise'),
	fs = require('fs'),
	opt = {
		url:src,
		encoding:'binary',
		// host:'127.0.0.1',
		// port:'60380'
	},
	proxyUrl = "http://127.0.0.1:60380",
	proxyRq = rq.defaults({'proxy': proxyUrl});

	let img = await proxyRq(opt);
	fs.writeFileSync('tmpVideo.mp4',img,'binary');
	console.log('Ok。。#')
}


async function bin(){
	let images = require('./tumblr.json'),
		count = 1;
	console.log('图片共计-》',images.length)
	for(let image of images){
		try{
			await downloadImg(image,count++);
		}catch(error){
			console.log('[ERROR]->',error)
		}
		
	}
	console.log('全部下载完毕.',count)
}
bin()
