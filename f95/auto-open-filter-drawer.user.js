// ==UserScript==
// @name        F95 Auto Open Filter Drawer
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.3.20
// @author      Edexal
// @description Automatically open the filter drawer when visiting the Latest Update page.
// @homepageURL https://sleazyfork.org/en/scripts/541896-f95-auto-open-filter-drawer
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@6f21f564da48e53fa3a53075b1316731f4cf07e4/_lib/utility.js
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
