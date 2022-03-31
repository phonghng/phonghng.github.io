/*
* Method: DetectAdblock
* Version: 1.4
* Author: PhongHNg
* Source: https://github.com/phonglan123/archive/blob/main/DetectAdblock.js
*/

class DetectAdblock {
   constructor(options = {}) {
       return new Promise(async (resolve, reject) => {
           let
               start_time = performance.now(),
               checklist = [];

           checklist = checklist.concat(this.BlockAdBlock_sitexw());

           checklist = checklist.concat(await this.fetch_GoogleAd());

           checklist = checklist.concat(await this.ads_element());

           checklist = checklist.concat(await this.fetch_ads_files());

           if (options.custom_element)
               checklist = checklist.concat(
                   this.custom_ads_element(options.custom_element)
               );

           if (options.custom_url)
               checklist = checklist.concat(
                   await this.custom_ads_url(options.custom_url)
               );

           const count_occurrences = (array, value) => array.reduce((a, v) => (v === value ? a + 1 : a), 0);

           let
               checklist_ratio = count_occurrences(checklist, true) / checklist.length,
               execute_time = performance.now() - start_time;

           resolve(checklist_ratio >= 0.7);
       });
   }

   BlockAdBlock_sitexw() {
       /*
        * Method: BlockAdBlock
        * Version: 3.2.1 (minified)
        * Author: Valentin Allaire
        * Source: https://github.com/sitexw/BlockAdBlock
        */

       let adblock_detected = false;

       !function (t) { var e = function (e) { this._options = { checkOnLoad: !1, resetOnEnd: !1, loopCheckTime: 50, loopMaxNumber: 5, baitClass: "pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links", baitStyle: "width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;", debug: !1 }, this._var = { version: "3.2.1", bait: null, checking: !1, loop: null, loopNumber: 0, event: { detected: [], notDetected: [] } }, void 0 !== e && this.setOption(e); var o = this, i = function () { setTimeout(function () { o._options.checkOnLoad === !0 && (o._options.debug === !0 && o._log("onload->eventCallback", "A check loading is launched"), null === o._var.bait && o._creatBait(), setTimeout(function () { o.check() }, 1)) }, 1) }; void 0 !== t.addEventListener ? t.addEventListener("load", i, !1) : t.attachEvent("onload", i) }; e.prototype._options = null, e.prototype._var = null, e.prototype._bait = null, e.prototype._log = function (t, e) { console.log("[BlockAdBlock][" + t + "] " + e) }, e.prototype.setOption = function (t, e) { if (void 0 !== e) { var o = t; t = {}, t[o] = e } for (var i in t) this._options[i] = t[i], this._options.debug === !0 && this._log("setOption", 'The option "' + i + '" he was assigned to "' + t[i] + '"'); return this }, e.prototype._creatBait = function () { var e = document.createElement("div"); e.setAttribute("class", this._options.baitClass), e.setAttribute("style", this._options.baitStyle), this._var.bait = t.document.body.appendChild(e), this._var.bait.offsetParent, this._var.bait.offsetHeight, this._var.bait.offsetLeft, this._var.bait.offsetTop, this._var.bait.offsetWidth, this._var.bait.clientHeight, this._var.bait.clientWidth, this._options.debug === !0 && this._log("_creatBait", "Bait has been created") }, e.prototype._destroyBait = function () { t.document.body.removeChild(this._var.bait), this._var.bait = null, this._options.debug === !0 && this._log("_destroyBait", "Bait has been removed") }, e.prototype.check = function (t) { if (void 0 === t && (t = !0), this._options.debug === !0 && this._log("check", "An audit was requested " + (t === !0 ? "with a" : "without") + " loop"), this._var.checking === !0) return this._options.debug === !0 && this._log("check", "A check was canceled because there is already an ongoing"), !1; this._var.checking = !0, null === this._var.bait && this._creatBait(); var e = this; return this._var.loopNumber = 0, t === !0 && (this._var.loop = setInterval(function () { e._checkBait(t) }, this._options.loopCheckTime)), setTimeout(function () { e._checkBait(t) }, 1), this._options.debug === !0 && this._log("check", "A check is in progress ..."), !0 }, e.prototype._checkBait = function (e) { var o = !1; if (null === this._var.bait && this._creatBait(), (null !== t.document.body.getAttribute("abp") || null === this._var.bait.offsetParent || 0 == this._var.bait.offsetHeight || 0 == this._var.bait.offsetLeft || 0 == this._var.bait.offsetTop || 0 == this._var.bait.offsetWidth || 0 == this._var.bait.clientHeight || 0 == this._var.bait.clientWidth) && (o = !0), void 0 !== t.getComputedStyle) { var i = t.getComputedStyle(this._var.bait, null); !i || "none" != i.getPropertyValue("display") && "hidden" != i.getPropertyValue("visibility") || (o = !0) } this._options.debug === !0 && this._log("_checkBait", "A check (" + (this._var.loopNumber + 1) + "/" + this._options.loopMaxNumber + " ~" + (1 + this._var.loopNumber * this._options.loopCheckTime) + "ms) was conducted and detection is " + (o === !0 ? "positive" : "negative")), e === !0 && (this._var.loopNumber++, this._var.loopNumber >= this._options.loopMaxNumber && this._stopLoop()), o === !0 ? (this._stopLoop(), this._destroyBait(), this.emitEvent(!0), e === !0 && (this._var.checking = !1)) : (null === this._var.loop || e === !1) && (this._destroyBait(), this.emitEvent(!1), e === !0 && (this._var.checking = !1)) }, e.prototype._stopLoop = function (t) { clearInterval(this._var.loop), this._var.loop = null, this._var.loopNumber = 0, this._options.debug === !0 && this._log("_stopLoop", "A loop has been stopped") }, e.prototype.emitEvent = function (t) { this._options.debug === !0 && this._log("emitEvent", "An event with a " + (t === !0 ? "positive" : "negative") + " detection was called"); var e = this._var.event[t === !0 ? "detected" : "notDetected"]; for (var o in e) this._options.debug === !0 && this._log("emitEvent", "Call function " + (parseInt(o) + 1) + "/" + e.length), e.hasOwnProperty(o) && e[o](); return this._options.resetOnEnd === !0 && this.clearEvent(), this }, e.prototype.clearEvent = function () { this._var.event.detected = [], this._var.event.notDetected = [], this._options.debug === !0 && this._log("clearEvent", "The event list has been cleared") }, e.prototype.on = function (t, e) { return this._var.event[t === !0 ? "detected" : "notDetected"].push(e), this._options.debug === !0 && this._log("on", 'A type of event "' + (t === !0 ? "detected" : "notDetected") + '" was added'), this }, e.prototype.onDetected = function (t) { return this.on(!0, t) }, e.prototype.onNotDetected = function (t) { return this.on(!1, t) }, t.BlockAdBlock = e, void 0 === t.blockAdBlock && (t.blockAdBlock = new e({ checkOnLoad: !0, resetOnEnd: !0 })) }(window);

       let
           adBlockNotDetected = () => adblock_detected = false,
           adBlockDetected = () => adblock_detected = true;

       if (typeof blockAdBlock !== "undefined"
           || typeof BlockAdBlock !== "undefined")
           adblock_detected = true;

       delete window.BlockAdBlock;
       delete window.blockAdBlock;

       return [adblock_detected, adblock_detected, adblock_detected];
   };

   fetch_GoogleAd() {
       /*
        * Method: Send request to Google Ads
        * Version: 2021-04-21T17:50:54.000Z
        * Author: Cumulo Nimbus
        * Source: https://stackoverflow.com/a/38963456/16319071
        */

       return new Promise(async (resolve, reject) => {
           let adblock_detected = false;

           let google_ads_url = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
           try {
               await fetch(new Request(google_ads_url)).catch(_ => adblock_detected = true);
           } catch (e) {
               adblock_detected = true;
           } finally {
               resolve([adblock_detected, adblock_detected]);
           };
       });
   };

   ads_element() {
       /*
        * Method: Using HTML element with ads classes
        * Version: 2016-11-07T10:29:01.000Z
        * Author: godblessstrawberry
        * Source: https://stackoverflow.com/questions/4869154/how-to-detect-adblock-on-my-website#comment68170476_38963456
        */

       return new Promise((resolve, reject) => {
           let adblock_detected = false;

           let element = document.createElement("div");
           element.classList.add("ads", "ad", "adsbox", "doubleclick", "ad-placement", "carbon-ads", "adBar", "banner_ad");
           element.style = "height: 1px; width: 1px; position: absolute; left: -999px; top: -999px;";
           element.innerHTML = "&nbsp;";
           document.body.appendChild(element);

           setTimeout(() => {
               if (!element
                   || getComputedStyle(element).display == "none"
                   || !element.offsetHeight
                   || element.clientHeight === 0
                   || element.innerHTML.length == 0)
                   adblock_detected = true;

               document.body.removeChild(element);

               resolve([adblock_detected, adblock_detected]);
           }, 1000);
       });
   };

   fetch_ads_files() {
       /*
        * Method: Send requests to files whose names have "ads"
        * Version:
        * Author:
        * Source: https://www.detectadblock.com/
        *         https://stackoverflow.com/a/20505898/16319071
        *         https://easylist-downloads.adblockplus.org/easylist.txt
        */

       return new Promise(async (resolve, reject) => {
           let adblock_detected = false;

           let fetch_list = ["adwordstracking.js", "ads.js", "ads.txt", "prebid-ads.js", "ads", "adsbygoogle.js", "adframe.js"];
           fetch_list.forEach(async (fetch_path, index) => {
               let fetch_url = new URL(location.href).origin + "/" + fetch_path;
               try {
                   await fetch(new Request(fetch_url)).catch(_ => adblock_detected = true);
               } catch (e) {
                   adblock_detected = true;
               } finally {
                   if (index + 1 == fetch_list.length)
                       resolve([adblock_detected, adblock_detected]);
               };
           });
       });
   };

   custom_ads_element(element_list) {
       /*
        * Method: Custom ads element check
        * Version:
        * Author:
        * Source:
        */

       let checklist = [];

       element_list.forEach(element => {
           let adblock_detected = false;
           if (!element
               || getComputedStyle(element).display == "none"
               || !element.offsetHeight
               || element.clientHeight === 0
               || element.innerHTML.length == 0)
               adblock_detected = true;
           checklist.push(adblock_detected);
       });

       return checklist;
   };

   custom_ads_url(url_list) {
       /*
        * Method: Custom ads url check
        * Version:
        * Author:
        * Source:
        */

       return new Promise(async (resolve, reject) => {
           let checklist = [];

           for (const [index, url] of url_list.entries()) {
               let adblock_detected = false;
               try {
                   await fetch(new Request(url)).catch(_ => adblock_detected = true);
               } catch (e) {
                   adblock_detected = true;
               } finally {
                   checklist.push(adblock_detected);
                   if (index + 1 == url_list.length)
                       resolve(checklist);
               };
           };
       });
   };
};
