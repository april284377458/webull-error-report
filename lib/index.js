const { postErrorUrl } = require("../url-config");
const axios = require('axios');
const moment = require('moment');

function getMachineTypeFromAgent() {
   let machineType = "Unknown OS";
   let system = "Unknown system";
   if (!navigator) {
      return;
   }
   let { appVersion, userAgent: nAgt, appName: browserName } = navigator;
   if (appVersion.indexOf("Win") !== -1) {
      machineType = "Windows";
      system = (appVersion.split(";") || [""])[0];
   } else if (appVersion.indexOf("Mac") !== -1) {
      machineType = "MacOS";
      system = (appVersion.split(";") || ["", ""])[1];
   } else if (appVersion.indexOf("X11") !== -1) {
      machineType = "UNIX";
   } else if (appVersion.indexOf("Linux") !== -1) {
      machineType = "Linux";
   }
   let nameOffset, verOffset;
   // In Opera, the true version is after "Opera" or after "Version"
   if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browserName = "Opera";
   }
   // In MSIE, the true version is after "MSIE" in userAgent
   else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
   }
   // In Chrome, the true version is after "Chrome"
   else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
   }
   // In Safari, the true version is after "Safari" or after "Version"
   else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browserName = "Safari";
   }
   // In Firefox, the true version is after "Firefox"
   else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
   }
   // In most other browsers, "name/version" is at the end of userAgent
   else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
      browserName = nAgt.substring(nameOffset, verOffset);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
         browserName = appName;
      }
   }
   return { machineType, system, browserName };
}

const errorReport = function (data) {
   try {
      let { machineType = "", system = "", browserName = "" } = getMachineTypeFromAgent() || {};
      data = { machineType, system, browserName, creatTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), ...data };
      return axios.post(postErrorUrl, data)
      .then(function () {
         return { status: "success" };
      })
      .catch(function (err) {
         return { status: "fail", error: `提交崩溃日期失败，原因：${err.message}` };
      });
   } catch (err) {
      return { status: "fail", error: `提交崩溃日期失败，原因：${err.message}` };
   }; 
}

export default errorReport;