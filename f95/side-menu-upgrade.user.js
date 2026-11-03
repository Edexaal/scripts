// ==UserScript==
// @name        F95 Side Menu Upgrade
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.0
// @author      Edexal
// @description Improves side menu.
// @homepageURL https://sleazyfork.org/en/scripts/546346-f95-mobile-upgrade
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// ==/UserScript==
(() => {
  const BOOKMARK_LABEL = 'Bookmarks';
  Edexal.addCSS(`
  .uix_sidebarNav a.p-navEl-link:not(.mdi):not(.fa)[data-nav-id="${BOOKMARK_LABEL}"]::before {
    content: "\\f02e";
  }`);
  const EL = {sideMenu: '.uix_sidebarNav ul'};
  
  function createSideMenuBM(latestUpdateList) {
    const bookmarkList = latestUpdateList.cloneNode(true);
    const a = bookmarkList.querySelector('a');
    a.href = `${location.origin}/watched/threads?tab=bookmarks`;
    a.dataset.navId = BOOKMARK_LABEL;
    const span = a.querySelector('span');
    span.textContent = BOOKMARK_LABEL;
    return bookmarkList;
  }
  
  function upgradeSideMenu() {
    const sideMenu = Edexal.$(EL.sideMenu);
    if (!sideMenu) return;
    const latestUpdate = sideMenu.querySelector('li a[data-nav-id="LatestUpdates"]');
    if (!latestUpdate) return;
    const latestUpdateList = latestUpdate.parentElement.parentElement.parentElement;
    const bookmarkList = createSideMenuBM(latestUpdateList);
    sideMenu.prepend(latestUpdateList);
    sideMenu.prepend(bookmarkList);
  }
  
  upgradeSideMenu();
})();