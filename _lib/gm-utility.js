// ==UserScript==
// @name        Edexal's GM API Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     0.1.0
// @author      Edexal
// @description Utility library for useful GM.* tasks.
// ==/UserScript==

class EdexalGM {
  // REQUIRES: GM.httpxmlRequest permission
  static getAsync(url, resType){
    return new Promise((resolve, reject) => {
      GM.httpxmlRequest({
        method: 'GET',
        url,
        onload: resolve,
        onerror: reject,
        responseType: resType || 'document'
      });
    });
  }
}