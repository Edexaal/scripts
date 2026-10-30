// ==UserScript==
// @name        Edexal's Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     4.0.0
// @author      Edexal
// @description Utility library for common reusable tasks
// ==/UserScript==
class Edexal {
  static #bookmarkPath = 'watched/threads?tab=bookmarks';
  static #latestUpdatePath = 'sam/latest_alpha';
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
  
  static decodeHTMLEntities(txt) {
    const textArea = Edexal.newEl({element: 'textarea'});
    textArea.innerHTML = txt;
    return textArea.value;
  }

  static #runOn(includesPath, callback) {
    if (location.href.includes(includesPath)) {
      if (callback) {
        callback();
      }
      return true;
    }
    return false;
  }

  static runOnLatestUpdatePage(callback) {
    Edexal.#runOn(Edexal.#latestUpdatePath, callback);
  }

  static runOnBookmarkPage(callback) {
    Edexal.#runOn(Edexal.#bookmarkPath, callback);
  }
  
  static isBookmarkPage() {
    return Edexal.#runOn(Edexal.#bookmarkPath);
  }
  
  static isLatestUpdatePage() {
    return Edexal.#runOn(Edexal.#latestUpdatePath);
  }
  
  static isGameThread() {
    let breadcrumbID = Edexal.$$("ul.p-breadcrumbs li:nth-of-type(2) a span[itemprop=name]");
    let isGame = false;
    if (!!breadcrumbID.length) {
      breadcrumbID.forEach((curVal) => {
        if (curVal.textContent.toLowerCase() === "Games".toLowerCase()) {
          isGame = true;
        }
      });
    }
    return isGame;
  }
  
  static runOnGameThread(callback) {
    if (Edexal.isGameThread()) {
      callback();
    }
  }
  
  //Inclusive random number generator
  static getRandIntInc(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}