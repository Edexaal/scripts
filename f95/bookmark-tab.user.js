// ==UserScript==
// @name        F95 Bookmark Tab
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.1.1
// @author      Edexal
// @description Restores 'bookmark' tab link on navigation bar. Also on Latest Update Page, replaces a tab with 'BOOKMARK'.
// @homepageURL https://sleazyfork.org/en/scripts/601301-f95-bookmark-tab
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@23f86bce8d8c88bc66704d0971ba7eb11be92caa/_lib/utility.js
// ==/UserScript==

(() => {
  Edexal.addCSS(`
  .p-nav-list .p-navEl:hover::after {
    right: 0;
  }`);
  const BM_LINK = '/watched/threads?tab=bookmarks';
  
  // Swap FORUM if available otherwise swap out SEARCH (usually on mobile)
  function swapForBM() {
    let headerLinkEl = Edexal.$('.p-nav-list li:nth-child(2) a'); // FORUMS
    if (!headerLinkEl) {
      headerLinkEl = Edexal.$('.p-nav-list li:first-child a'); // SEARCH
    }
    headerLinkEl.href = BM_LINK;
    headerLinkEl.querySelector('span').textContent = 'Bookmarks';
  }
  
  function getMarkNav(subNav) {
    for (const el of subNav.children) {
      const spanEl = el.querySelector('span');
      if (spanEl.textContent.toLowerCase().startsWith('mark')) {
        return el;
      }
    }
  }
  
  function addBMToSubNav() {
    const subNav = Edexal.$('.p-sectionLinks-list');
    if (!subNav){
      return;
    }
    const markEl = getMarkNav(subNav);
    if (!markEl) {
      return;
    }
    const aTag = markEl.querySelector('a');
    aTag.href = BM_LINK;
    aTag.dataset.navId = "bookmarks";
    markEl.querySelector('span').textContent = "Bookmarks";
  }
  
  function run() {
    Edexal.runOnLatestUpdatePage(swapForBM);
    addBMToSubNav();
  }
  run();
})()