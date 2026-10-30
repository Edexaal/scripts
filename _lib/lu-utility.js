// ==UserScript==
// @name        Edexal's Latest Update Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     0.1.0
// @author      Edexal
// @description Utility library for useful Latest Update page tasks.
// ==/UserScript==

// Handles listening to page navigations on latest update page.
class LUPageObserver {
  #delayTimeMS;
  #timerID;
  
  constructor(delayTimeMS = 1500) {
    this.#delayTimeMS = delayTimeMS;
  }
    
  #onPageChange(records, obs, pageCB,canExecuteCB) {
    if (this.#timerID ||  typeof canExecuteCB === "function" && !canExecuteCB()) {
      return;
    }
    this.#timerID = setTimeout(() => {
      pageCB();
      this.#timerID = null;
    }, this.#delayTimeMS);
  }

  #initObserver(pageCB, canExecuteCB) {
    const observer = new MutationObserver((records, obs) => this.#onPageChange(records, obs, pageCB, canExecuteCB));
    const pageNavBar = document.querySelector("#sub-nav_inner .sub-nav_paging");
    observer.observe(pageNavBar, {attributeFilter: ['class']});
  }

  observe(pageChangeCB, canExecuteCB) {
    this.#initObserver(pageChangeCB, canExecuteCB);
  }
}

// Extract basic tags from the include tag setting on the latest update page 
class LUBasicTagExtractor {
  #tagList;
  
  #storeTagsToList() {
    const dropDownTags = document.querySelectorAll('#filter-block_tags .selectize-dropdown-content .option');
    this.#tagList = {};
    dropDownTags.forEach((el) => {
      //Ex: '2d game' : 1112
      const tagName = el.querySelector('span:first-child').textContent;
      this.#tagList[tagName] = el.dataset.value;
    });
    return this.#tagList;
  }
  
  #observeTagReveal(records,obs,resolve) {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.classList?.contains('option')) {
          obs.disconnect();
          resolve(this.#storeTagsToList());
          return;
        }
      }
    }
  }
  
  #runOnTagReveal() {
    return new Promise((resolve) => {
      const observer = new MutationObserver((records, obs) => this.#observeTagReveal(records,obs,resolve));
      observer.observe(document.querySelector('#filter-block_tags .selectize-dropdown-content'), {subtree: true, childList: true});
    });
  }
  // Procs loading of all tags for current category
  #procTagLoading() {
    document.querySelector('#filter-block_tags .selectize-input').click();
  }
  
  async getTagsAsync() {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(1500);
    const result = this.#runOnTagReveal();
    this.#procTagLoading();
    return await result;
  }
}