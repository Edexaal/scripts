// ==UserScript==
// @name        F95 New Review Modal
// @namespace   1330126-edexal
// @match       *://f95zone.to/*/reviews/
// @grant       -
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.1
// @author      Edexal
// @description Improvements when creating new reviews.
// @homepageURL https://sleazyfork.org/en/scripts/603855-f95-new-review-modal
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// ==/UserScript==
(() => {
  Edexal.addCSS(`
  /*New Review Modal styles*/
  .overlay-container.f95rv-writeOverlay .overlay {
    max-width: initial;
  }
  .overlay-container.f95rv-writeOverlay .f95rv-dialog {
    margin: 0 auto;
    max-width: 80vw;
  }
  /* New Review Textbox */
  .f95rv-dialog-text > div.fr-box {
    /* height: 60vh !important; */
    & .fr-wrapper {
      max-height: 60vh !important;
      & .fr-element {
        min-height: 59vh !important;
      }
    } 
  }`);
})();