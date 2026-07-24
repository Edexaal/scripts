// ==UserScript==
// @name        Edexal's Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     3.1.0
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
          el.classList.add(...val);
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