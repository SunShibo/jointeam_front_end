var data = {
	"payOrderNumber": "总订单数",
	"paymentAmount": "丢失订单数",
	"userNumber": "总用户",
	"asd":"阿斯顿",
	"qwe":"请问",
	"g":"个",
	"xx":"信息",
	"cc":"储存",
}

var arrEName = Object.keys(data);
var arrCName = Object.values(data);

String.prototype.getCName = function(list) {
	var testObj = [];
	var it = [];
	list.forEach((item, index, value) => {
		var i = arrEName.indexOf(item[0]);
		it = [arrCName[i],item[1]];
		testObj.push(it);
	}); 
	return testObj;
}