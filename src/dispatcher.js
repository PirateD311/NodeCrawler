'use strict'
const fs = require('fs');
const Spider = require('./spider')
module.exports = 
class Dispatcher{
	constructor(taskList){
		this.taskList = taskList||[];
		this.current = {
			index:0,
			task:{}
		};
	}
	/**
	 * 添加任务进Dispatcher
	 * 
	 */
	push(task){
		if(!task.url)throw '任务必须包含url';
		this.taskList.push(task);
	}

	/**
	 * 获得下一个Task
	 * 返回待执行的Task;
	 */
	next(){
		this.current.task = this.taskList[this.current.index];
		return this.taskList[this.current.index++];
	}

	/**
	 * 是否还有下一个任务
	 */
	hasNext(){
		if(this.current.index<this.taskList.length)return true;
		else return false;
	}

	/**
	 * 下一个爬虫任务，同时执行
	 * @param {* Spider} spider 负责爬虫工作的实例  
	 */
	async doNext(spider){
		let task = this.taskList[++this.current.index];
		this.current.task = task;
		try{
			console.log(JSON.stringify(spider,null,2));
			spider.test();
			await spider.work(task.url);
			console.log('Task Done...');
		}catch(e){
			await handleTasksFail(e);
		}
	}

	async handleTasksFail(error){
		console.log(error);
		let StopLog = {
			index:this.current.index,
			task:this.current.task,
			error
		};
		fs.writeFileSync('ErrorLog.log',JSON.stringify(StopLog,null,2));
	}

	stat(){
		console.log('任务总计->',this.taskList.length,'  当前进度->',this.current.index);
	}
}