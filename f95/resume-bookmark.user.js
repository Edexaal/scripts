// ==UserScript==
// @name        Resume Bookmark
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       GM.setValue
// @grant       GM.getValues
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.1.3
// @author      Edexal
// @description Visit bookmark page with the last tag filter selected.
// @homepageURL https://sleazyfork.org/en/scripts/571484-resume-bookmark
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require      https://cdn.jsdelivr.net/gh/Edexaal/scripts@20abbf4a49807e7d11a081eb3a8573d0cab83c1f/_lib/utility.js
// ==/UserScript==
(async () => {
  function addBtnEvent() {
    const button = Edexal.$('form[action*=bookmarks] span.menu-footer-controls button');
    Edexal.on(button, 'click', async () => {
      const textBoxEl = Edexal.$("form[action*=bookmarks] li.select2-selection__choice");
      await GM.setValue("label", textBoxEl ? textBoxEl.title : null);
    });
  }

  function addTagRemoveBtnEvent(cssSelector) {
    const button = Edexal.$(cssSelector);
    if (!button) return;
    Edexal.on(button, 'click', async () => {
      await GM.setValue("label", null);
    });
  }

  function removeBookmarkFilter() {
    setTimeout(() => {
      const filterMenuActive = Edexal.$("div.menu[id].is-active");
      if (!filterMenuActive) return;
      const filterBtnClose = Edexal.$(".select2-selection__choice__remove");
      if (!filterBtnClose) return;
      filterBtnClose.click();
    }, 200);
  }

  function initBookmarkLabel() {
    const filtersLink = Edexal.$(".filterBar-menuTrigger");
    Edexal.on(filtersLink,"click",removeBookmarkFilter);
  }

  async function run() {
    if (location.href.includes("account/bookmarks")) {
      initBookmarkLabel();
      addBtnEvent();
      addTagRemoveBtnEvent("div.filterBar ul.filterBar-filters a.filterBar-filterToggle");
      const storage = await GM.getValues({was_bookmark: false, label: null});
      if (storage.was_bookmark) {
        return;
      }
      await GM.setValue("was_bookmark", true);
      if (location.search.includes("label=")) {
        return;
      }
      if (storage.label) {
        location.replace(location.search === "" ? `${location.href}?label=${storage.label}` : `${location.href}&label=${storage.label}`);
      }
    } else {
      await GM.setValue("was_bookmark", false);
    }
  }

  await run();
})()