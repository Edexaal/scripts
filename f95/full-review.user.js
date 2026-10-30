// ==UserScript==
// @name        F95 Full Review
// @namespace   1330126-edexal
// @match       *://f95zone.to/*/reviews*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.1
// @author      Edexal
// @description Show full review automatically, with no "Read more" button.
// @homepageURL https://sleazyfork.org/en/scripts/602704-f95-full-review
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@6f21f564da48e53fa3a53075b1316731f4cf07e4/_lib/utility.js
// ==/UserScript==
(() => {
  function observeReviews(records, obs) {
    for (const record of records) {
      if (!record.target.classList.contains('hidden')){
        record.target.click();
        record.target.remove();
      }
    }
    obs.disconnect();
  }

  function run() {
    const observer = new MutationObserver(observeReviews);
    observer.observe(Edexal.$('.f95rv-cards'), {subtree: true,attributeFilter: ['hidden']});
  }
run();
})();