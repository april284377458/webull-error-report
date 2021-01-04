declare type ResultType = "success" | "fail";

declare interface initData{
    appid : string, 
    version : string, 
    region : string
}

declare interface sendData {   
    stack : string;// 错误堆栈字符串  
    record?:  string;// 操作记录
    region?: string;// 地区
} 

declare interface result {
    status : ResultType;
    message? : string;
}

declare function errorReportFun(data: sendData) : result; 

declare function initFun(data : initData) : result;  
 
declare function pushRecordFun(data: string); 

declare class ErrorReport {
    init : typeof  initFun;
    report : typeof  errorReportFun;
    pushRecord: typeof  pushRecordFun;
}

declare const errortool : ErrorReport; 

export default errortool;
 

