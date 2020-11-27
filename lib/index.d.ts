declare type ResultType = "success" | "fail";

declare interface data {  
    message : string;// 错误消息
    stack : string;// 错误堆栈字符串  
    record?:  string;// 操作记录
    region?: string;// 地区
} 

declare interface result {
    status : ResultType;
    message? : string;
}

declare function errorReport(data: data) : result; 

declare function initFun(application : string, version : string, isPre : boolean) : result;  
 
declare class ErrorReport {
    init : initFun;
    report : errorReport;
}

declare const errortool : ErrorReport; 

export default errortool;
 

