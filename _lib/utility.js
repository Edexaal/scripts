// ==UserScript==
// @name        Edexal's Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     3.1.1
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
  #delayTimeMS = 1500;
  #timerID;

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