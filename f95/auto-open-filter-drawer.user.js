// ==UserScript==
// @name        F95 Auto Open Filter Drawer
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.3.21
// @author      Edexal
// @description Automatically open the filter drawer when visiting the Latest Update page.
// @homepageURL https://sleazyfork.org/en/scripts/541896-f95-auto-open-filter-drawer
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@dafe3f6b3497ea15a2de012c4828598b7c197ead/_lib/utility.js
// ==/UserScript==
(() => {
  function openDrawer() {
    const observer = new MutationObserver(() => {
      const drawerButton = Edexal.$('#controls_filter-toggle');
      if (drawerButton) {
        drawerButton.click();
        observer.disconnect();
      }
    });
    observer.observe(Edexal.$('#latest-page_sub-nav'), {
      subtree: true,
      childList: true
    });
  }

  openDrawer();
})();
