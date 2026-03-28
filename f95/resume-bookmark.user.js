// ==UserScript==
// @name        Resume Bookmark
// @namespace   1330126-edexal
// @match       *://f95zone.to/account/bookmarks*
// @match       *://f95zone.to/*
// @grant       GM.setValue
// @grant       GM.getValues
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.0
// @author      Edexal
// @description Visit bookmark page with the last tag filter selected.
// @homepageURL https://sleazyfork.org/en/scripts/571484-resume-bookmark
// @supportURL  https://github.com/Edexaal/scripts/issues
// ==/UserScript==
(async () => {
  function addBtnEvent() {
    const button = document.querySelector('form[action*=bookmarks] span.menu-footer-controls button');
    button.addEventListener('click', async () => {
      const textBoxEl = document.querySelector("form[action*=bookmarks] li.select2-selection__choice");
      await GM.setValue("label", textBoxEl ? textBoxEl.title : null);
    });
  }
  function addTagRemoveBtnEvent(cssSelector) {
    const button = document.querySelector(cssSelector);
    if (!button) return;
    button.addEventListener('click', async () => {
      await GM.setValue("label", null);
    });
  }

  async function run() {
    if (location.href.includes("account/bookmarks")) {
      addBtnEvent();
      addTagRemoveBtnEvent("div.filterBar ul.filterBar-filters a.filterBar-filterToggle");
      const storage = await GM.getValues({was_bookmark: false, label: null});
      if (storage.was_bookmark) {
        return;
      }
      await GM.setValue("was_bookmark", true);
      if (storage.label) {
        location.replace(location.search === "" ? `${location.href}?label=${storage.label}` : `${location.href}&label=${storage.label}`);
      }
    } else {
      await GM.setValue("was_bookmark", false);
    }
  }

  await run();
})()