// ==UserScript==
// @name        F95 Auto Open Filter Drawer
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.3.7
// @author      Edexal
// @description Automatically open the filter drawer when visiting the Latest Update page.
// @homepageURL https://sleazyfork.org/en/scripts/541896-f95-auto-open-filter-drawer
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@20abbf4a49807e7d11a081eb3a8573d0cab83c1f/_lib/utility.js
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
