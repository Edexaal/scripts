// ==UserScript==
// @name        Edexal's CSS Library
// @namespace   1330126-edexal
// @license     Unlicense
// @version     1.0.0
// @author      Edexal
// @description CSS library for reusable css styles.
// ==/UserScript==
class EdexalCSS {
  static bgColor = 'linear-gradient(to top left, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.2) 30%, rgb(0 0 0 / 0)) #ba4545';
  static secTxtColor = '#fc9b46'; //Orangy color
  // Makes bookmark label dropdown smaller and scrollable 
  static bmScrollLabelMenu() {
    return `div.tagify__dropdown__wrapper {
      overflow-y: auto;
      height: min(30vh, 240px);
    }`;
  }
  // Default styles for buttons
  static btnRules() {
    return `
    background: ${EdexalCSS.bgColor};
    color: yellow;
    border: 1px solid #a4a4a4;
    border-radius: 5px;
    transition: opacity .2s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
        opacity: 0.8;
        cursor: pointer;
        border-color: #9adc49;
    }
    &:active {
        opacity: 0.6;
    }`;
  }
}