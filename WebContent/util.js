exports.util = {
	/**
	 * 格式化日期时间字符串
	 * 
	 * @param{Date} dt datetime
	 * @param{String} fmt format string. 'yyyy-MM-dd hh:mm:ss'
	 * @returns
	 */
	dateTime2str : function(dt, fmt) {
		var z = {
			M : dt.getMonth() + 1,
			d : dt.getDate(),
			h : dt.getHours(),
			m : dt.getMinutes(),
			s : dt.getSeconds(),
			ms : dt.getMilliseconds()
		};
		fmt = fmt.replace(/(M+|d+|h+|m+|s+|ms)/g, function(v) {
			return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)))
					.slice(-2);
		});
		return fmt.replace(/(y+)/g, function(v) {
			return dt.getFullYear().toString().slice(-v.length);
		});
	},
	/**
	 * 根据日期时间格式获取获取当前日期时间
	 * 
	 * @prarm{String} "yyyy-MM-dd hh:mm:ss";
	 */
	dateTimeWrapper : function(fmt) {
		if (arguments[0])
			fmt = arguments[0];
		return this.dateTime2str(new Date(), fmt);
	},
	/**
	 * 获取当前日期时间
	 * 
	 * @param{String} arguments 可设置一个日期时间格式,如:'yyyy/MM/dd hh:mm:ss'
	 * @returns
	 */
	getDatetime : function() {
		return this.dateTimeWrapper('yyyy-MM-dd hh:mm:ss.ms');
	},
	/**
	 * 获取当前日期时间+毫秒
	 * 
	 * @returns {String}
	 */
	getDatetimes : function() {
		var dt = new Date();
		return this.dateTime2str(dt, 'yyyy-MM-dd hh:mm:ss') + '.'
				+ dt.getMilliseconds();
	},
	getDate : function() {
		return this.dateTimeWrapper('yyyy-MM-dd');
	},
	getTime : function() {
		return this.dateTimeWrapper('hh:mm:ss');
	},
	getTimes : function() {
		var dt = new Date();
		return this.dateTime2str(dt, 'hh:mm:ss') + '.' + dt.getMilliseconds();
	},
	getTimestamp : function() {
		// Number(new Date())
		// new Date().valueOf()
		return new Date().getTime();
	}
};