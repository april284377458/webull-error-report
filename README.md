# webull-error-report web站点崩溃上报工具

使用此工具将终端崩溃信息上报到服务平台进行分析
use it report the webullApp's error to decomple server

# example1  使用例子1：

## script 页签插入方式
```js    
  window.webullReport = [];
  window.webullReport.push({ event : "init", data : { appid : "h5-user", version : "3.12", region : "us" } }); 
  window.webullReport.push({ event : "record", data : "测试操作" });   
  window.onerror = function(message, source, lineno, colno, error) {  
    window.webullReport.push({ event : "error", data : error });  
  };  
  (function () {  
    var a = document.createElement("script");  
    a.type = "text/javascript";  
    a.async = !0;  
    a.src = "https://pub.webull.com/global/tools/report1.5.js";   
    var b = document.getElementsByTagName("script")[0];  
    b.parentNode.insertBefore(a, b)  
  })();  
```
# example2  使用例子2：
## nodejs  common引入方式
```js
import reportTool from "webull-error-report"   
/*  
*@p1 平台  
*@p2 版本号  
*@p3 是否上报到预演  
*@p3 是否上报到预演 
*/  
reportTool.init({ appid : "h5-user", version : "3.12", region : "us" });    
reportTool.pushRecord("我是操作");   
reportTool.report({ stack : "" });  
```