class DateTiem {
	// 新的天数减去旧的天数
	// 相当于格式 data 
	/*
		
	*/
	static diffDay(loadTiem,arr,currendTiem = Date.now()){
		let day = this.getDateTiem(currendTiem);
		let day1 = this.getDateTiem(loadTiem);
		// 先判断是是不是一天
		// 如果等于
		let val = day.day - day1.day
		
		const item = ['hours','minutes']
		
		let funArr = !(arr instanceof Array) ? [
			() => {
				return val == 0 ? day1.toString(":",item) : false 
			},
			()=>{
				return val == 1 ? '昨天 ' + day1.toString(":",item) : false
			},
			()=>{
				return val> 1 && val <= 7 ? day1.getDay() + day1.toString(":",item) : false
 			},
			() => {
				return day.year - day1.year === 0 ? day1.toString('*',['month','day']) : day1.toString('*',['year','month','day'])
			}
		] : arr
		
		let reuslt = this.ReFunction(funArr)
		
		return reuslt
	}
	
	static getDateTiem(item = Date.now()){
		item = item * 1
		const date = new Date(item)
		return {
			year:date.getFullYear(),
			month:date.getMonth() + 1,
			day:date.getDate(),
			hours:date.getHours(),
			minutes:date.getMinutes(),
			seconds:date.getSeconds(),
			milliseconds:date.getMilliseconds(),
			toString( type = "*" ,options = ['year','month','day','hours','minutes','seconds']){
				let date = {
					year:'年',
					month:'月',
					day:'日',
					hours:'时',
					minutes:'分',
					seconds:'秒',
					milliseconds:'毫秒',
				}
				
				let str = ''
				
				options.forEach(key=>{
					let connector = type === "*" ? date[key] : type
					let val = this[key];
					str += val + connector
				})	
				
				if(type !=="*"){
					str = str.slice(0,str.length - 1);
				}
				
				return str
			},
			// 获取星期几
			getDay(){
				let day = date.getDay();
				const dayArr =  ['星期天','星期一','星期二','星期三','星期四','星期五','星期六']
				return dayArr[day]
			}
		}
	}
	
	static ReFunction(funArr){
		let reuslt = funArr.map(el=>el()).filter(el => Boolean(el))[0]
		return reuslt
	}
}




export default DateTiem