// ==UserScript==
// @name        Edexal's Bookmark Page Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     0.1.0
// @author      Edexal
// @description Utility library for useful bookmark page tasks.
// ==/UserScript==

// Auto-Removes chosen label when opening the 'Label' menu
class BMAutoLabelRemover {
  #removeBookmarkFilter() {
    setTimeout(() => {
      const filterMenuActive = document.querySelector("div.menu.is-active");
      if (!filterMenuActive) return;
      const filterBtnClose = document.querySelector(".tagify__tag__removeBtn");
      if (!filterBtnClose) return;
      filterBtnClose.click();
    }, 200);
  }

  start() {
    if (location.href.includes('watched/threads?tab=bookmarks')) {
      const filtersLink = document.querySelector(".f95wg-labelMenu .menuTrigger");
      filtersLink.addEventListener('click', this.#removeBookmarkFilter);
    }
  }
}