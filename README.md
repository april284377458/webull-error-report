# webull-error-report
use it report the webullApp's error to decomple server

# example1   
## script 页签插入方式     
  window.webullReport = [];
  window.webullReport.push({ event : "init", data : { app : "h5-user", version : "3.12", pre : true,  region : "us" } }); 
  window.webullReport.push({ event : "record", data : "测试操作" });   
  window.onerror = function(message, source, lineno, colno, error) {  
    window.webullReport.push({ event : "error", data : error });  
  };  
  (function () {  
    var a = document.createElement("script");  
    a.type = "text/javascript";  
    a.async = !0;  
    a.src = "https://pub.webull.com/global/tools/report1.4.js";   
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
*@p3 是否上报到预演 
*/  
reportTool.init({ app : "h5-user", version : "3.12", pre : true,  region : "us" });    
reportTool.pushRecord("我是操作");   
reportTool.report({ stack : "" });  
