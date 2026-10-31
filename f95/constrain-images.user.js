// ==UserScript==
// @name        F95 Constrain Images
// @namespace   1330126-edexal
// @match       *://f95zone.to/threads/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.0
// @author      Edexal
// @description Shrink large images to a reasonable size.
// @homepageURL -
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// ==/UserScript==
(() =>{
  /*Configure values here:
   * maxHeightAllowed: Maximum image height allowed before a resize is needed for an image.
   * newMaxWidth: Maximum image width to change to if resize is need.
   * */
  const CONFIG = {maxHeightAllowed: 700, newMaxWidth: 500};
  const OBSERVER_STATS = {totalImages: 0, imagesObservedNum: 0};

  function applySizeConstraint(el) {
      if (el.height <= CONFIG.MAX_HEIGHT_ALLOWED) return;
      el.width = Math.min(CONFIG.newMaxWidth, el.width);
  }

  function observeImages(records,obs) {
    for (const record of records) {
      if (record.target.classList.contains("lazyloaded")) {
        applySizeConstraint(record.target);
        if (++OBSERVER_STATS.imagesObservedNum === OBSERVER_STATS.totalImages){
          obs.disconnect();
        }
      }
    }
  }

  function initObserver(imageEls) {
    const observer = new MutationObserver(observeImages);
    const options = {attributeFilter: ['class']};
    imageEls.forEach(img => observer.observe(img, options));
  }

  function run() {
    const images = Edexal.$$('img.bbImage');
    if (!images.length) return;
    OBSERVER_STATS.totalImages = images.length;
    initObserver(images);
  }
  run();
})();