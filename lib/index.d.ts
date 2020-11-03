declare type ResultType = "success" | "fail";

declare interface data { 
    version : string;  // 版本号
    message : string;// 错误消息
    stack : string;// 错误堆栈字符串 
}

declare interface result {
    status : ResultType;
    message? : string;
}

declare function errorReport(data: data) : result; 

declare function initFun(terminal : string, sourceMapUrl : string) : result;  
 
declare class ErrorReport {
    init : initFun;
    report : errorReport;
}

export default ErrorReport;
 

