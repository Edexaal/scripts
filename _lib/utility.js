// ==UserScript==
// @name        Edexal Utility Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     1.1
// @author      Edexal
// @description Utility library for common reusable tasks
// ==/UserScript==
const edexal = {
  //Apply custom styles in a style tag
  applyCSS(css) {
    let styleEl = document.querySelector("style");
    if (styleEl === null) {
      styleEl = document.createElement('style');
    }
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
  }
}
