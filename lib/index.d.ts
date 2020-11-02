declare const ResultType : ["success", "fail"];

interface data {

}

interface result {
    status : ResultType;
    error? : string;
}

declare function errorReport(data: data) : result; 
export default errorReport;
 

