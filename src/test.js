'use strict';
// import {Spider} from './spider'
const Spider = require('./spider');
const Dispatcher = require('./dispatcher');

class MySpider extends Spider{
	constructor(){
		super();
		this.fs = require('fs');
	}
	test(){
		this._log();
		console.log('Im son;')
	}

	handleHtml($){
		console.log($('title').text());

		console.log($('#blog_title').text());

		return $('#blog_title').text();
	}
	handleData(data){
		this.fs.writeFileSync('DD.text',data);
	}
}

class MyDispatcher extends Dispatcher{
	test(){
		console.log('MyDispatcher...');
	}
}

// test();
async function test(){
	let mySpider = new MySpider();
	mySpider.test();
	// let resp = await mySpider.request('http://blog.csdn.net/hongweigg/article/details/6824968');
	// let data = mySpider.handleHtml(mySpider.parse(resp));
	// mySpider.handleData(data);

	// await mySpider.work({url:'http://blog.csdn.net/hongweigg/article/details/6824968'});

	let myDisp = new MyDispatcher();
	myDisp.stat();
	myDisp.push({url:'http://blog.csdn.net/hongweigg/article/details/6824968'});
	myDisp.push({url:'http://blog.csdn.net/hongweigg/article/details/6824968'});
	myDisp.stat();

	while(myDisp.hasNext()){
		mySpider.test();
		await mySpider.work(myDisp.next())
		// await myDisp.doNext(mySpider);
		myDisp.stat();
	}

}


