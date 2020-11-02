declare type ResultType = "success" | "fail";

declare interface data { 
    terminal : string;// 平台终端
    version : string;  // 版本号
    message : string;// 错误消息
    stack : string;// 错误堆栈字符串 
}

declare interface result {
    status : ResultType;
    error? : string;
}

declare function errorReport(data: data) : result; 
export default errorReport;
 

