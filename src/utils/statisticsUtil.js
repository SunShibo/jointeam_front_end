var data = {
	"finishedCount": "已完成数量",
	"projectCount": "项目总数量",
	"paidMoney": "已付金额",
	"havingCount":"正在进行的项目数量",
	"balancePay":"剩余尾款",
	"rentalMoney":"项目总金额",
	"deferredMoney":"项目延期金额",
	"deferredCount":"已延期数量",
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