# webull-error-report
use it report the webullApp's error to decomple server

# example1  
webullErrorApp = "h5-user", // 必传 平台端  
window.webullErrorVer = "3.12",// 版本号  
window.webullErrorPre = true;// 是否上报到预演  
window.onerror = function(message, source, lineno, colno, error) {   
  window.webullError.push(error);  
};  
(function () {  
    var a = document.createElement("script");   
    a.type = "text/javascript";  
    a.async = !0;  
    a.src = "./errorIndex.js";  
    var b = document.getElementsByTagName("script")[0];  
    b.parentNode.insertBefore(a, b)  
})();

# example2
const reportObj = new ErrorReport();  
/*  
*@p1 平台  
*@p1 版本号  
*@p1 是否上报到预演  
*/  
reportObj.init("h5-user", "3.12", true);    
reportObj.report({ message : "",  stack : "" });  
