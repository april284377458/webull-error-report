const postDevErrorUrl = "https://pre-rep.webullbroker.com/collectImformation";
const postErrorUrl = "https://rep.webullbroker.com/collectImformation";


function postData(url, data) {
   return fetch(url, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      headers: {
         'content-type': 'application/json'
      },
      method: 'POST',
      mode: 'cors',
      referrer: 'no-referrer',
   })
      .then(response => response.json())
}


function getosFromAgent() {
   let os = "Unknown OS";
   let system = "Unknown system";
   let url = window.location.href;
   if (!navigator) {
      return { url };
   }
   let { appVersion, userAgent: nAgt, appName: browser } = navigator;
   if (appVersion.indexOf("Win") !== -1) {
      os = "Windows";
      system = (appVersion.split(";") || [""])[0];
   } else if (appVersion.indexOf("Mac") !== -1) {
      os = "MacOS";
      system = (appVersion.split(";") || ["", ""])[1];
   } else if (appVersion.indexOf("X11") !== -1) {
      os = "UNIX";
   } else if (appVersion.indexOf("Linux") !== -1) {
      os = "Linux";
   }
   let nameOffset, verOffset;
   // In Opera, the true version is after "Opera" or after "Version"
   if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      browser = "Opera";
   }
   // In MSIE, the true version is after "MSIE" in userAgent
   else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browser = "Microsoft Internet Explorer";
   }
   // In Chrome, the true version is after "Chrome"
   else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browser = "Chrome";
   }
   // In Safari, the true version is after "Safari" or after "Version"
   else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browser = "Safari";
   }
   // In Firefox, the true version is after "Firefox"
   else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browser = "Firefox";
   }
   // In most other browsers, "name/version" is at the end of userAgent
   else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
      browser = nAgt.substring(nameOffset, verOffset);
      if (browser.toLowerCase() == browser.toUpperCase()) {
         browser = appName;
      }
   }
   return { os, system, browser, url };
}

function generalID() {
   if (!localStorage) {
      return "";
   }
   let id = localStorage.getItem('errorReportId');
   if (!id) {
      id = `${(new Date()).valueOf()}${parseInt((Math.random() + 1) * 10000)}`;
      localStorage.setItem('errorReportId', id);
   }
   return id;
}


class ErrorReport {

   init(application, version = "", isPre = true) {
      this.application = application;
      this.version = version;
      this.isPre = isPre;
      this.cid = generalID();
   }

   report(data) {
      if (!this.application) {
         return { status: "fail", message: `缺少application` };
      }
      if (data instanceof Error) {
         data = { message: data.message, stack: data.stack };
      }
      try {
         let agentInfo = getosFromAgent() || {};
         data = { ...agentInfo, ...data, cid: this.cid, version: this.version, application: this.application };
         const postUrl = this.isPre ? postDevErrorUrl : postErrorUrl;
         return postData(postUrl, data)
            .then(data => {
               return data;
            })
            .catch(error => {
               return { status: "fail", error };
            })
      } catch (error) {
         return { status: "fail", error };
      };
   }

}

// 兼容异步加载自动模式
if (window.webullErrorApp) {
   window.webullError = window.webullError || [];
   const reportObj = new ErrorReport();
   reportObj.init(window.webullErrorApp, window.webullErrorVer, window.webullErrorPre);
   while (window.webullError.length > 0) {
      let data = window.webullError.shift();
      reportObj.report(data);
   }
   function ProxyPush(data) {
      reportObj.report(data);
   }
   window.webullError = new Proxy(window.webullError, {
      get: function (obj, prop) {
         if (prop === "push") {
            return ProxyPush;
         }
      }
   });
}

export default ErrorReport;
