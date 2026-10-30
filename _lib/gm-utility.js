// ==UserScript==
// @name        Edexal's GM API Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     0.1.1
// @author      Edexal
// @description Utility library for useful GM.* tasks.
// ==/UserScript==

class EdexalGM {
  // REQUIRES: GM.xmlhttpRequest permission
  static getAsync(url, resType){
    return new Promise((resolve, reject) => {
      GM.xmlhttpRequest({
        method: 'GET',
        url,
        onload: resolve,
        onerror: reject,
        responseType: resType || 'document'
      });
    });
  }
}