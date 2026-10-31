// ==UserScript==
// @name        F95 Unread Alert
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.1
// @author      Edexal
// @description Make unread alerts/posts/threads visibly clearer.
// @homepageURL https://sleazyfork.org/en/scripts/603074-f95-unread-alert
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// ==/UserScript==
(() => {
  'use strict';
  Edexal.addCSS(`
  :root {
    --ed-alert-text-color: #E8B85D;
    --ed-alert-bg-color: #1D1E25;
  }
  /*Alerts page account/alerts */
  .alert-list .js-alert.is-unread,
  /* Alerts notification menu. bell icon */
  .js-alertsMenuBody .alert.is-unread,
  /* all Forum sections. */
  .p-body-pageContent .structItemContainer .is-unread,
  /* Bottom homepage widget*/
  .f95st .is-unread  {
    background: var(--ed-alert-bg-color);
    &:hover {
      background: #313234;
    }
    & a {
      color: var(--ed-alert-text-color);
    }
  }
  `);
})();