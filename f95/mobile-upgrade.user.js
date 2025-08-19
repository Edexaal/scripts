// ==UserScript==
// @name        F95 Mobile Upgrade
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.1.1
// @author      Edexal
// @description Improves mobile experience
// @homepageURL https://sleazyfork.org/en/scripts/546346-f95-mobile-upgrade
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@18e8de8f54ed4045d4b6e000b4b43a4f136b7612/_lib/utility.js
// ==/UserScript==
(async () => {
  /*NOTE: F95 uses FontAwesome v5.15.4*/
  const STYLE_CSS = `
@media (width < 480px) {
  /*Fixes 'Your account' navigation menu*/ 
  #js-SideNavOcm .uix_sidebar--scroller {
    margin-top: 149px;
    & .block-header {
        padding: 14px;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        background-color: #37383a;
        color:#babbbc;
        &::before {
          content: "\\f007";
        }
    }
    & .block-body:nth-of-type(2) {
      margin-bottom: 20px;
    }
  }
  /*Fixes scroll buttons appearing behind threads*/
  .uix_fabBar {
    z-index: 50;
    & .u-scrollButtons {
      position: inherit;
      gap:10px;
      bottom: 55px;
      &.is-active {
        opacity: 0.6;
      }
      & a:last-child {
        margin-left: 0;
      }
      & a.button.button--scroll {
        padding: 6px 12px;
      }
    }
  }
  .has-hiddenscroll .u-scrollButtons {
	  right: 35vw;
  }
  
  /*Fixes sidebar list of all online members & staff*/
  body .p-body-sidebar {
    margin-top: 64px;
    margin-bottom: 45px;
    &::after {
      margin:initial;
    }
  }
}`;

  function isLatestUpdatePage() {
    return location.pathname.includes('sam/latest_alpha');
  }

  function setScrollBtn(selector, targetSelector, scrollType, altTargetSelector) {
    const scrollBtn = document.querySelector(selector);
    if (!scrollBtn) return;
    scrollBtn.removeAttribute('data-xf-click');
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(targetSelector) ?? document.querySelector(altTargetSelector);
      target.scrollIntoView({
        block: scrollType
      });
    });
  }

  function initScrollBtns() {
    setScrollBtn('.uix_fabBar .u-scrollButtons a:last-child',
      'div.block-outer:nth-child(4) > div:nth-child(1) > nav:nth-child(1) > div:nth-child(2)',
      'end',
      '#footer');
    setScrollBtn('.uix_fabBar .u-scrollButtons a:first-child',
      '.block--messages',
      'start',
      '#top');
  }

  function assignTabItem(name, pathURL, oldFaIcons, newFaIcons, itemPos) {
    const tabItem = document.querySelector(`.uix_tabBar .uix_tabList .uix_tabItem:nth-of-type(${itemPos})`);
    if (!tabItem) return;
    tabItem.href = pathURL;
    const icon = tabItem.querySelector('i');
    icon.classList.remove(...oldFaIcons);
    icon.classList.add(...newFaIcons);
    const labelDiv = tabItem.querySelector('div');
    labelDiv.textContent = name;
  }

  function initTabItems() {
    assignTabItem('Latest Updates', '/sam/latest_alpha/', ['far', 'fa-comment-alt-exclamation'], ['far', 'fa-gem'], 2);
    assignTabItem('Bookmarks', '/account/bookmarks/', ['far', 'fa-user'], ['far', 'fa-bookmark'], 1);
  }

  /*Removes all effects from tiles on Latest Update Page
   by removing all event listeners from tiles*/
  function removeTileHoverEffects() {
    if(!isLatestUpdatePage()) return;
    const tilesWrapper = document.querySelector('#latest-page_main-wrap');
    const tilesWrapperClone = tilesWrapper.cloneNode();
    tilesWrapperClone.append(...tilesWrapper.childNodes);
    const fragment = document.createDocumentFragment();
    fragment.append(tilesWrapperClone);
    tilesWrapper.replaceWith(fragment);
  }

  function run() {
    //Run only on mobile
    if(window.innerWidth >= 480) return;
    edexal.applyCSS(STYLE_CSS);
    initTabItems();
    initScrollBtns();
    setTimeout(removeTileHoverEffects,2000);
  }

  run();
})()