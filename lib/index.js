const postErrorUrl = "https://pre-rep.webullbroker.com/collectImformation";
const initUrl = "https://pre-rep.webullbroker.com/register";

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

class ErrorReport {

  init(terminal, sourceMapUrl) {
   if (location && !sourceMapUrl) {
      sourceMapUrl = location.host;
    }
    return axios.post(initUrl, { terminal, sourceMapUrl })
      .then(result => {
        if (result.data && result.data.status === "success") {
          this.terminal = terminal;
          this.sourceMapUrl = sourceMapUrl;
          return { status: "success" };
        }
        return result;
      })
      .catch(err => {
        console.log(err.message);
        return { status: "fail", message: `连接上报平台失败，无法上报，原因：${err.message}` };
      });
  }

  report(data) {
    if (!this.sourceMapUrl || !this.terminal) {
      return { status: "fail", message: `sourceMapUrl或者terminal没有填写 无法上报` };
    }
    try {
      let { machineType = "", system = "", browserName = "" } = getMachineTypeFromAgent() || {};
      data = { machineType, system, browserName, creatTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), terminal: this.terminal, ...data };
      return axios.post(postErrorUrl, data)
        .then(() => {
          return { status: "success" };
        })
        .catch(err => {
          console.log(err.message);
          return { status: "fail", message: `提交崩溃日期失败，原因：${err.message}` };
        });
    } catch (err) {
      console.log(err.message);
      return { status: "fail", message: `提交崩溃日期失败，原因：${err.message}` };
    };
  }
}

// 兼容异步加载自动模式
if (window.webullError && window.terminal, window.sourceMapUrl) {
  const reportObj = new ErrorReport();
  reportObj.init(window.terminal, window.sourceMapUrl).then((result) => {
    if (result.status === "success") {
      window.webullError.forEach(data => {
        reportObj.report(data);
      });
      window.webullError = new Proxy(data=> {
        reportObj.report(data);
      }, {
        apply(target, ctx, args) {
          return target(...args);
        }
      });
    }
  });
}

export default ErrorReport;
