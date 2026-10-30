// ==UserScript==
// @name        F95 Full Review
// @namespace   1330126-edexal
// @match       *://f95zone.to/*/reviews*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.4
// @author      Edexal
// @description Show full review automatically, with no "Read more" button.
// @homepageURL https://sleazyfork.org/en/scripts/602704-f95-full-review
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
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