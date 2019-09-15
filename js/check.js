uni.check=function (arr){
	if(arr.constructor!=Array){
		console.log('验证格式不正确！');
		return false;
	}
	var res=true;
	arr.forEach(function(v,i){
		if(!checkmin(v.type,v.data,v.where)){
			console.log(v.msg)
			res=false;
		}
	})
	return res;
}
function checkmin(checkType,checkVal,checkData){
	switch(checkType){
		case 'string' : 
			checkVal = checkVal.trim();
			if(!typeof(checkVal)=='string'){return false;}
		break;
		case 'int' :
			if(!typeof(checkVal)=='number'){return false;}
		break;
		case 'same' : 
			if(checkVal != checkData){return false;}
		break;
		case 'notSame' : 
			if(checkVal == checkData){return false;}
		break;
		case 'email' : 
			var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if(!reg.test(checkVal)){return false;}
		break;
		case 'phone' :
			var reg = /^1[0-9]{10}$/;
			if(!reg.test(checkVal)){return false;}
		break;
		case 'url'  :
			var reg = /^(\w+:\/\/)?\w+(\.\w+)+.*$/;
			if(!reg.test(checkVal)){return false;}
		break;
		case 'zipcode'  :
			var reg = /^[0-9]{6}$/;
			if(!reg.test(checkVal)){return false;}
		break;
	}
	return true;
}