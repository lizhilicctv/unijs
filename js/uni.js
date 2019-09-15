let uni = (function(selector, undefined) {
	let unibase = function(selector) {
		if (!selector) { //这个是空选择器
			return addFuns(new Array(document));
		}
		if (typeof(selector) == 'string') {
			selector = selector.trim();
			return addFuns(document.querySelectorAll(selector));
		}
		if (typeof(selector) == 'object') { //这个是用于调用原生对象
			return addFuns(new Array(selector));
		}
		return null;
	}
	let addFuns = function(doms) { //没有选择器的情况下，默认穿进去 dom
		let reObj = {
			dom: doms,
			length: doms.length
		};
		reObj.__proto__ = hExtends;
		return reObj; //这里是在原型上挂载方法
	}

	let hExtends = { //这些方法需要挂载到原型上面
		val: function(lets) {
			if (typeof(lets) != 'undefined') {
				for (let i = 0; i < this.length; i++) {
					this.dom[i].value = lets;
				}
				return this;
			}
			return this.dom[0].value;
		},
		hasClass: function(cls) {
			if (this.length != 1) {
				return {
					'msg': '请选择一个元素'
				};
			}
			if (this.dom[0].className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
				return true;
			}
			return false;
		},
		addClass: function(cls) {
			if (this.length < 1) {
				return this;
			}
			for (let i = 0; i < this.length; i++) {
				if (!this.dom[i].className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))) {
					this.dom[i].className += " " + cls;
				}
			}
			return this;
		},
		delClass: function(cls) {
			if (this.length < 1) {
				return this;
			}
			let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			for (let i = 0; i < this.length; i++) {
				this.dom[i].className = this.dom[i].className.replace(reg, ' ');
			}
			return this;
		},
		isShow: function() {
			if (this.length != 1) {
				return {
					'msg': '请选择一个元素'
				};
			}
			if (this.dom[0].currentStyle) {
				let showRes = this.dom[0].currentStyle.display;
			} else {
				let showRes = getComputedStyle(this.dom[0], null).display;
			}
			if (showRes == 'none') {
				return false;
			}
			return true;
		},
		hide: function() {
			if (this.length < 1) {
				return this;
			}
			for (let i = 0; i < this.length; i++) {
				this.dom[i].style.display = 'none';
			}
			return this;
		},
		show: function() {
			if (this.length < 1) {
				return this;
			}
			for (let i = 0; i < this.length; i++) {
				this.dom[i].style.display = 'block';
			}
			return this;
		},
		each: function(callBack) {
			for (let i = 0; i < this.length; i++) {
				this.dom[i].index = i;
				callBack(this.dom[i]);
			}
		}, //原生变量不好用，用这个
		html: function(html) {
			if (this.length < 1) {
				return this;
			}
			if (typeof(html) != 'undefined') {
				for (let i = 0; i < this.length; i++) {
					this.dom[i].innerHTML = html;
				}
				return this;
			}
			return this.dom[0].innerHTML;
		},
		//下面是筛选器
		find: function(selector) {
			if (this.length != 1) {
				return this;
			}
			return addFuns(this.dom[0].querySelectorAll(selector));
		},
		eq: function(index) {
			return addFuns(new Array(this.dom[index]));
		},
		last: function() {
			return addFuns(new Array(this.dom[this.length - 1]));
		},
		first: function() {
			return addFuns(new Array(this.dom[0]));
		},
		next: function() {
			return addFuns(new Array(this.dom[0].nextElementSibling || this.dom[0].nextSibling));
		}, //返回兄弟下一个
		parent: function() {
			return addFuns(new Array(this.dom[0].parentNode));
		},
		css: function(cssObj) {
			if (this.length < 1) {
				return this;
			}
			if (typeof(cssObj) == 'string') { //自己编写返回style 样式
				if (eval('this.dom[0].style.' + cssObj)) {
					return eval('this.dom[0].style.' + cssObj);
				} else {
					return eval('window.getComputedStyle(this.dom[0], null).' + cssObj);
				}
			}
			for (let i = 0; i < this.length; i++) {
				let styleObj = this.dom[i].style;
				for (let k in cssObj) {
					eval('styleObj.' + k + ' = "' + cssObj[k] + '";'); //eval执行函数
				}
			}
			return this;
		},
		clone: function() { //这个是克隆
			if (this.length < 1) {
				return this;
			}
			let nodeClone = this.dom[0].cloneNode(true);
			return addFuns(new Array(nodeClone));
		},
		sTo: function(parentObj) {
			if (this.length < 1) {
				return this;
			}
			if (typeof(parentObj) == 'object') {
				let data;
				if (parentObj.length) {
					data = parentObj.dom[0];
				} else {
					data = parentObj;
				}
				console.log(data)
				for (let i = 0; i < this.length; i++) {
					this.dom[i].insertBefore(data, this.dom[i].firstChild);
				}
			} else if (typeof(parentObj) == 'string') {
				for (let i = 0; i < this.length; i++) {
					this.dom[i].innerHTML = parentObj + this.dom[i].innerHTML;
				}
			}
		},
		eTo: function(parentObj) { //追加，可以是字符串，也可以是对象
			if (this.length < 1) {
				return this;
			}
			if (typeof(parentObj) == 'object') {
				let data;
				if (parentObj.length) {
					data = parentObj.dom[0];
				} else {
					data = parentObj;
				}
				console.log(data)
				for (let i = 0; i < this.length; i++) {
					this.dom[i].appendChild(data);
				}
			} else if (typeof(parentObj) == 'string') {
				for (let i = 0; i < this.length; i++) {
					this.dom[i].innerHTML += parentObj;
				}
			}
		},
		del: function() {
			if (this.length < 1) {
				return this;
			}
			for (let i = 0; i < this.length; i++) {
				this.dom[0].parentNode.removeChild(this.dom[0]);
			}
		},
		attr: function(attrName, val) { //下面是关于属性的
			if (this.length < 1) {
				return this;
			}
			if (typeof(val) != 'undefined') {
				for (let i = 0; i < this.length; i++) {
					this.dom[i].setAttribute(attrName, val);
				}
				return this;
			}
			return this.dom[0].getAttribute(attrName);
		},
		delAttr: function(attrName) {
			if (this.length < 1) {
				return this;
			}
			for (let i = 0; i < this.length; i++) {
				this.dom[i].removeAttribute(attrName);
			}
			return this;
		},
		height: function(isOffset) { //这个是计算块的高度，默认不计算边框
			if (this.length != 1) {
				return 0;
			}
			if (isOffset) {
				return this.dom[0].offsetHeight;
			}
			return this.dom[0].clientHeight;
		},
		width: function(isOffset) { //这个是计算块的宽度，默认不计算边框
			if (this.length != 1) {
				return 0;
			}
			if (isOffset) {
				return this.dom[0].offsetWidth;
			}
			return this.dom[0].clientWidth;
		},
		offset: function() { //这个是偏移量，这个是计算出元素距离浏览器边的距离
			if (this.length != 1) {
				return {
					left: 0,
					top: 0,
					msg: '多元素不能获取偏移'
				};
			}
			let e = this.dom[0],
				offset = {
					left: 0,
					top: 0
				};
			offset.left = e.offsetLeft;
			offset.top = e.offsetTop;
			while (e = e.offsetParent) {
				offset.top += e.offsetTop;
				offset.left += e.offsetLeft;
			}
			return offset;
		},
		tap: function(callBack) { //下面是事件
			if (this.length < 1) {
				return true;
			}
			this.dom[0].addEventListener('click', callBack);
		},
		ltap: function(callBack) { //下面是事件
			if (this.length < 1) {
				return true;
			}
			this.dom[0].addEventListener('touchstart', function() {
				timer = setTimeout(callBack, 800);
			});
			this.dom[0].addEventListener('touchend', function() {
				clearTimeout(timer);
				timer = 0;
			});
			this.dom[0].addEventListener('touchmove', function() {
				clearTimeout(timer);
				timer = 0;
			});
		},
		sleft: function(callBack) {
			if (this.length < 1) {
				return true;
			}
			let one = true;
			this.dom[0].addEventListener('touchstart', function(evt) {
				var touch = evt.touches[0]; //获取第一个触点
				window.SX = Number(touch.pageX); //页面触点X坐标
			});
			this.dom[0].addEventListener('touchmove', function(evt) {
				//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
				var touch = evt.touches[0]; //获取第一个触点
				window.MX = Number(touch.pageX); //页面触点X坐标
				if (window.SX - window.MX >=50 && one) {
					one=false;
					callBack();
				}
			});
		},
		sright: function(callBack) {
			if (this.length < 1) {
				return true;
			}
			let one = true;
			this.dom[0].addEventListener('touchstart', function(evt) {
				var touch = evt.touches[0]; //获取第一个触点
				window.SX = Number(touch.pageX); //页面触点X坐标
			});
			this.dom[0].addEventListener('touchmove', function(evt) {
				//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
				var touch = evt.touches[0]; //获取第一个触点
				window.MX = Number(touch.pageX); //页面触点X坐标
				if (window.MX - window.SX >=50 && one) {
					one=false;
					callBack();
				}
			});
		},
		sup: function(callBack) {
			if (this.length < 1) {
				return true;
			}
			let one = true;
			this.dom[0].addEventListener('touchstart', function(evt) {
				var touch = evt.touches[0]; //获取第一个触点
				window.SY = Number(touch.pageY); //页面触点Y坐标
			});
			this.dom[0].addEventListener('touchmove', function(evt) {
				//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
				var touch = evt.touches[0]; //获取第一个触点
				window.MY = Number(touch.pageY); //页面触点Y坐标
				if (window.SY - window.MY >=50 && one) {
					one=false;
					callBack();
				}
			});
			
		},
		sdown: function(callBack) {
			if (this.length < 1) {
				return true;
			}
			let one = true;
			this.dom[0].addEventListener('touchstart', function(evt) {
				var touch = evt.touches[0]; //获取第一个触点
				window.SY = Number(touch.pageY); //页面触点Y坐标
			});
			this.dom[0].addEventListener('touchmove', function(evt) {
				//evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
				var touch = evt.touches[0]; //获取第一个触点
				window.MY = Number(touch.pageY); //页面触点Y坐标
				if (window.MY - window.SY >=50 && one) {
					one=false;
					callBack();
				}
			});
		}
	}
	//下面都是添加方法,这个是外层的方法，就是这个是，uni的方法，上面的，原型是，uni选择元素之后的方法
	unibase.scrollTop = function(val) { //设置滚动条位置
		if (!val) {
			return document.documentElement.scrollTop;
		} //这个是获取值
		document.documentElement.scrollTop = val; //这个是设置值
	};
	unibase.winInfo = function() { //获取屏幕大小
		let winInfo = {
			height: 0,
			width: 0,
			scrollTop: 0
		};
		if (window.innerHeight) {
			winInfo.height = window.innerHeight;
		} else if ((document.body) && (document.body.clientHeight)) {
			winInfo.height = document.body.clientHeight;
		}
		if (window.innerWidth) {
			winInfo.width = window.innerWidth;
		} else if ((document.body) && (document.body.clientWidth)) {
			winInfo.width = document.body.clientWidth;
		}
		if (document.documentElement && document.documentElement.scrollTop) {
			winInfo.scrollTop = document.documentElement.scrollTop;
		} else if (document.body) {
			winInfo.scrollTop = document.body.scrollTop;
		}
		return winInfo;
	}
	//下面是ajax
	unibase.ajax = function(method, url, data, callback, flag) {
		flag = flag || true; //默认采用异步模式
		method = method.toUpperCase();
		var xhr = null;
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else {
			xhr = new ActiveXObject('Microsoft.XMLHttp');
		}
		//当参数以json格式传入时，转化成字符串&格式
		if (typeof data === 'object') {
			var tempArr = [];
			for (var key in data) {
				var value = data[key]
				tempArr.push(key + '=' + value)
			}
			data = tempArr.join('&')
		}
		if (method == 'POST') {
			xhr.open(method, url, flag);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(data);
		}
		if (method == 'GET') {
			url += ('?' + data);
			xhr.open(method, url, flag);
			xhr.send();
		}
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					callback(this.responseText)
				} else {
					console.log("出错了，请排查原因！");
				}
			}
		}
	}
	//在封装一个post其他的就不封装了
	unibase.post = function(url, data, callback) {
		this.ajax('post', url, data, callback);
	}
	return unibase;
})(document);
