# webull-error-report
use it report the webullApp's error to decomple server

# example1   
## script 页签插入方式   
  window.webullErrorApp = "h5-user", // 必传 平台端  
  window.webullErrorVer = "3.12",// 版本号  
  window.webullErrorPre = true;// 是否上报到预演  
  window.onerror = function(message, source, lineno, colno, error) {  
  window.webullError.push(error);  
};  
(function () {  
  var a = document.createElement("script");  
  a.type = "text/javascript";  
  a.async = !0;  
  a.src = "https://pub.webull.com/global/tools/report-1.0.js";   
  var b = document.getElementsByTagName("script")[0];  
  b.parentNode.insertBefore(a, b)  
})();  

# example2  
## nodejs  
import reportTool from "webull-error-report"   
/*  
*@p1 平台  
*@p2 版本号  
*@p3 是否上报到预演  
*/  
reportTool.init("h5-user", "3.12", true);    
reportTool.report({ message : "",  stack : "" });  
