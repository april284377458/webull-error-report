const { postErrorUrl } = require("../url-config");
const axios = require('axios');  

const errorReport = function(data){
    return axios.post(postErrorUrl, data)
    .then(function () {
       return { status : "success" };
    })
    .catch(function (err) {
       return { status : "fail", error : `提交崩溃日期失败，原因：${err.message}` };
    });
}

export default  errorReport ;