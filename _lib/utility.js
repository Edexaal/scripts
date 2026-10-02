// ==UserScript==
// @name        Edexal's Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     3.2.0
// @author      Edexal
// @description Utility library for common reusable tasks
// ==/UserScript==
class Edexal {
  static addCSS(css) {
    let styleEl = document.querySelector("style");
    if (styleEl === null) {
      styleEl = document.createElement('style');
    }
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }

  static newEl(elObj) {
    if (!Object.hasOwn(elObj, 'element')) return;
    const el = document.createElement(elObj.element);
    const {element, ...otherObjs} = elObj;
    for (const [key, val] of Object.entries(otherObjs)) {
      switch (key) {
        case 'class':
          if(val) {
            el.classList.add(...val);
          }
          break;
        case 'text':
          const txt = document.createTextNode(val);
          el.append(txt);
          break;
        default:
          el.setAttribute(key, val);
          break;
      }
    }
    return el;
  }

  static on(el, eventType, callback, options) {
    el.addEventListener(eventType, callback, options);
  }

  static off(el, eventType, callback, options) {
    el.removeEventListener(eventType, callback, options);
  }

  static $(selectors) {
    return document.querySelector(selectors);
  }

  static $$(selectors) {
    return document.querySelectorAll(selectors);
  }

  static #runOn(includesPath, callback) {
    if (location.pathname.includes(includesPath)) {
      callback();
    }
  }

  static runOnLatestUpdatePage(callback) {
    Edexal.#runOn('sam/latest_alpha', callback);
  }

  static runOnBookmarkPage(callback) {
    Edexal.#runOn('account/bookmarks', callback);
  }
}

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
    const pageNavBar = Edexal.$("#sub-nav_inner .sub-nav_paging");
    observer.observe(pageNavBar, {attributeFilter: ['class']});
  }

  observe(pageChangeCB, canExecuteCB) {
    this.#initObserver(pageChangeCB, canExecuteCB);
  }
}

// Extract basic tags from the include tag setting on the latest update page 
class BasicTagExtractor {
  #tagList;
  
  #storeTagsToList() {
    const dropDownTags = Edexal.$$('#filter-block_tags .selectize-dropdown-content .option');
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
      observer.observe(Edexal.$('#filter-block_tags .selectize-dropdown-content'), {subtree: true, childList: true});
    });
  }
  // Procs loading of all tags for current category
  #procTagLoading() {
    Edexal.$('#filter-block_tags .selectize-input').click();
  }
  
  async getTagsAsync() {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(1500);
    const result = this.#runOnTagReveal();
    this.#procTagLoading();
    return await result;
  }
}