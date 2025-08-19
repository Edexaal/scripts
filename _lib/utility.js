// ==UserScript==
// @name        Edexal's Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     2.0
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

  static onEv(el, eventType, callback, options) {
    el.addEventListener(eventType, callback, options);
  }
}