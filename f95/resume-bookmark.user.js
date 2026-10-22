// ==UserScript==
// @name        F95 Resume Bookmark
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       GM.setValue
// @grant       GM.getValues
// @grant       GM.getValue
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.1.12
// @author      Edexal
// @description Visit bookmark page with the last tag filter selected.
// @homepageURL https://sleazyfork.org/en/scripts/571484-resume-bookmark
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@89a1caba9a2b639ca66314018b4746d4cdecb029/_lib/utility.js
// ==/UserScript==
(async () => {
  const EL = {
    chosenLabel: 'div.f95wg-bar a[data-original-title], div.f95wg-bar a[title]',
    labelsBtn: '.f95wg-labelMenu .menuTrigger',
    removeLabelSearch: '.select2-selection__choice__remove'
  };
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
      const filterMenuActive = Edexal.$("div.menu.is-active");
      if (!filterMenuActive) return;
      const filterBtnClose = Edexal.$(EL.removeLabelSearch);
      if (!filterBtnClose) return;
      filterBtnClose.click();
    }, 200);
  }

  function initBookmarkLabel() {
    const filtersLink = Edexal.$(EL.labelsBtn);
    Edexal.on(filtersLink, "click", removeBookmarkFilter);
  }
  
  async function replaceBookmarkLink() {
    const bmTab = Edexal.$('.tabs .hScroller a[href="/watched/threads?tab=bookmarks"]');
    if (!bmTab) {
      return;
    }
    const label = await GM.getValue('label');
    if (!label) {
      return;
    }
    bmTab.href = `${bmTab.href}&label=${label}`;
  }

  async function run() {
    if (Edexal.isBookmarkPage()) {
      initBookmarkLabel();
      addBtnEvent();
      addTagRemoveBtnEvent(EL.chosenLabel);
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
      await replaceBookmarkLink();
    }
  }

  await run();
})()