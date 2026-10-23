// ==UserScript==
// @name        F95 Bookmark Tab
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.4
// @author      Edexal
// @description Restores 'bookmark' tab link on navigation bar. Also on Latest Update Page, replaces 'FORUMS' tab with 'BOOKMARK'.
// @homepageURL https://sleazyfork.org/en/scripts/601301-f95-bookmark-tab
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3fcde43d7e7e48680ea5fb2715febcfd82058257/_lib/utility.js
// ==/UserScript==

(() => {
  Edexal.addCSS(`
  .p-nav-list .p-navEl:hover::after {
    right: 0;
  }`);
  const BM_LINK = '/watched/threads?tab=bookmarks';
  
  function swapForumNav() {
    const forumLinkEl = Edexal.$('.p-nav-list li:nth-child(2) a');
    forumLinkEl.href = BM_LINK;
    forumLinkEl.querySelector('span').textContent = 'Bookmarks';
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
    Edexal.runOnLatestUpdatePage(swapForumNav);
    addBMToSubNav();
  }
  run();
})()