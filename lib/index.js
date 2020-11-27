const usErrorUrl = "https://rep.webullbroker.com/collectImformation";
const globalErrorUrl = "https://rep.webullbroker.com/collectImformation"; 
const devErrorUrl = "https://pre-rep.webullbroker.com/collectImformation";

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
   let osv = "Unknown system";
   let url = window.location.href;
   let referer = document.referrer;
   if (!navigator) {
      return { url };
   }
   let { appVersion, userAgent: nAgt, appName: platform } = navigator;
   if (appVersion.indexOf("Win") !== -1) {
      os = "Windows";
      osv = (appVersion.split(";") || [""])[0];
   } else if (appVersion.indexOf("Mac") !== -1) {
      os = "MacOS";
      osv = (appVersion.split(";") || ["", ""])[1];
   } else if (appVersion.indexOf("X11") !== -1) {
      os = "UNIX";
   } else if (appVersion.indexOf("Linux") !== -1) {
      os = "Linux";
   }
   let nameOffset, verOffset;
   // In Opera, the true version is after "Opera" or after "Version"
   if ((verOffset = nAgt.indexOf("Opera")) != -1) {
      platform = "Opera";
   }
   // In MSIE, the true version is after "MSIE" in userAgent
   else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      platform = "Microsoft Internet Explorer";
   }
   // In Chrome, the true version is after "Chrome"
   else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      platform = "Chrome";
   }
   // In Safari, the true version is after "Safari" or after "Version"
   else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      platform = "Safari";
   }
   // In Firefox, the true version is after "Firefox"
   else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      platform = "Firefox";
   }
   // In most other platforms, "name/version" is at the end of userAgent
   else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
      platform = nAgt.substring(nameOffset, verOffset);
      if (platform.toLowerCase() == platform.toUpperCase()) {
         platform = appName;
      }
   }
   return { os, osv, platform, url, referer };
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

   init({ app, version = "", isPre = true, region = "gloabl" }) {
      this.application = app;
      this.version = version;
      this.isPre = isPre;
      this.region = region;
      this._records = [];
      this.cid = generalID();
      if (isPre) {
         this._postUrl = devErrorUrl;
      } else {
         this._postUrl = region === "global" ? globalErrorUrl : usErrorUrl;
      }
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
         data = { ...agentInfo, ...data, cid: this.cid, version: this.version, application: this.application, records: this._records };
         if (process.env.NODE_ENV === "development") {
            console.log("推送啦~~~");
            console.log("地址：", this._postUrl);
            console.log("数据：", data);
            return;
         }
         return postData(this._postUrl, data)
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

   pushRecord(records) {
      this._records.push(records);
   }

}

const reportTool = new ErrorReport();

// 兼容异步加载自动模式
if (window.webullReport) {
   let initOptions = window.webullReport.find(({ event }) => event === "init");
   if (!initOptions) {
      throw new Error("上报工具需要先初始化才能上报");
   }
   reportTool.init(initOptions.data);
   const handleData = ({ event, data }) => {
      switch (event) {
         case "record":
            reportTool.pushRecord(data);
            break;
         case "error":
            reportTool.report(data);
            break;
      }
   }
   while (window.webullReport.length > 0) {
      let r = window.webullReport.shift();
      handleData(r);
   }
   Object.defineProperty(window, 'webullReport', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: { push : handleData }
   });

}

export default reportTool;
