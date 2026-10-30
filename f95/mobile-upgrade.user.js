// ==UserScript==
// @name        F95 Mobile Upgrade
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     2.1.5
// @author      Edexal
// @description Improves mobile experience
// @homepageURL https://sleazyfork.org/en/scripts/546346-f95-mobile-upgrade
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/bm-utility.js
// ==/UserScript==
(async () => {
  // NOTE: F95 uses FontAwesome v5.15.4
  const SELECTOR = {
    latestUpdate: '#latest-page_main-wrap',
    latestFilterDrawer: '#latest-page_filter-wrap',
  };
  const MAX_SCREEN_WIDTH = 480;
  Edexal.addCSS(`
@media (width <= ${MAX_SCREEN_WIDTH}px) {
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
      gap: 10px;
      bottom: 60px;
      left: 41vw;
      &.is-active {
        opacity: 0.6;
      }
      & a:last-child {
        margin-left: 0;
      }
      & a.button.button--scroll {
        padding: 6px 12px;
        & .button {
          font-size: inherit;
        }
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
  /*Fixes: Some game threads sticky header bar is messed up. Ex: Jujutsu Trainer*/
  div.uix_headerContainer div.p-navSticky {
      width: 100vw !important;
      &.is-sticky {
          right: auto !important;
      }
  }
  body {
    padding-top: inherit !important;
  }
  /*Fixes: Broken sticky bottom navbar on some game threads. Ex: JuJutsu Trainer*/
  div.uix_tabList {
    width: 100vw;
  }
  /*latest update header*/
  .headList {
    margin-top: 5px;
    font-size: 1.6rem !important;
  }
  /*Filter navbar in latest update*/
  #latest-page_sub-nav {
    position: sticky;
    z-index: 220;
    top: 60px;
  }
  /*Tag dropdown when bookmarking thread*/
  div.tagify__dropdown__wrapper {
    overflow-y: auto;
    height: min(30vh, 240px);
  }
}`);

  function getValidScrollTarget(targetSelectors) {
    for (const targetSelector of targetSelectors) {
      const target = Edexal.$(targetSelector);
      if(target) {
        return target;
      }
    }
  }

  function createCustomScrollBtns(topTargets, bottomTargets) {
    const uixFabBar = Edexal.newEl({element: 'div', class: ['uix_fabBar', 'uix_fabBar--active']});

    const divScrollButtons = Edexal.newEl({
      element: 'div',
      class: ['u-scrollButtons', 'js-scrollButtons'],
      "data-trigger-type": "both"
    });

    const aTopButton = Edexal.newEl({element: 'a', href: "#top", class: ['button--scroll', 'ripple-JsOnly', 'button']});
    const spanTopText = Edexal.newEl({element: 'span', class: ['button-text']});
    const iTop = Edexal.newEl({element: 'i', class: ['fa--xf', 'far', 'fa-arrow-up'], "aria-hidden": "true"});
    const spanTopSR = Edexal.newEl({element: 'span', class: ['u-srOnly'], text: 'Top'});
    iTop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"/></svg>`;
    

    const aBottomButton = Edexal.newEl({
      element: 'a',
      href: '#footer',
      class: ['button--scroll', 'ripple-JsOnly', 'button']
    });
    const spanBottomText = Edexal.newEl({element: 'span', class: ['button-text']});
    const iBottom = Edexal.newEl({element: 'i', class: ['fa--xf', 'far', 'fa-arrow-down'], "aria-hidden": "true"});
    const spanBottomSR = Edexal.newEl({element: 'span', class: ['u-srOnly'], text: 'Bottom'});
    iBottom.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"/></svg>`;
    
    Edexal.on(aTopButton, 'click', (e) => {
      e.preventDefault();
      const target = getValidScrollTarget(topTargets);
      target.scrollIntoView({
        block: 'start'
      });
    });
    Edexal.on(aBottomButton, 'click', (e) => {
      e.preventDefault();
      const target = getValidScrollTarget(bottomTargets);
      target.scrollIntoView({
        block: 'end'
      });
    });
    spanTopText.append(iTop, spanTopSR);
    aTopButton.append(spanTopText);
    divScrollButtons.append(aTopButton);

    spanBottomText.append(iBottom, spanBottomSR);
    aBottomButton.append(spanBottomText);
    divScrollButtons.append(aBottomButton);

    uixFabBar.append(divScrollButtons);
    return uixFabBar;
  }

  function setScrollBtn(selector, targetSelector, scrollType, altTargetSelector) {
    const scrollBtn = Edexal.$(selector);
    if (!scrollBtn) return false;
    scrollBtn.removeAttribute('data-xf-click');
    Edexal.on(scrollBtn, 'click', (e) => {
      e.preventDefault();
      const target = Edexal.$(targetSelector) ?? Edexal.$(altTargetSelector);
      target.scrollIntoView({
        block: scrollType
      });
    });
    return true;
  }

  function initScrollBtns() {
    const bottomTargets = ['div.block-outer:nth-child(4) > div:nth-child(1) > nav:nth-child(1) > div:nth-child(2)', '.message--post:last-child', '#footer.p-footer'];
    const topTargets = ['.block--messages', '#top'];
    const footer = Edexal.$("#footer.p-footer");
    const scrollBtnDiv = createCustomScrollBtns(topTargets, bottomTargets);
    footer.insertAdjacentElement('afterend', scrollBtnDiv);
  }

  function assignTabItem(name, pathURL, newFaIcons, svg, itemPos) {
    const tabItem = Edexal.$(`.uix_tabBar .uix_tabList .uix_tabItem:nth-of-type(${itemPos})`);
    if (!tabItem) return;
    tabItem.href = pathURL;
    const icon = tabItem.querySelector('i');
    const classValues = icon.classList.values();
    for (const classVal of classValues) {
      if (classVal.startsWith('far') || classVal.startsWith('fa-')) {
        icon.classList.remove(classVal);
      }
    }
    icon.classList.add(...newFaIcons);
    icon.innerHTML = svg;
    const labelDiv = tabItem.querySelector('div.uix_tabLabel');
    labelDiv.textContent = name;
  }

  function initTabItems() {
    let fontAwesomeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"/></svg>`;
    assignTabItem('Latest Updates', '/sam/latest_alpha/', ['fa--xf', 'far', 'fa-gem'], fontAwesomeSVG, 1);
    fontAwesomeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"/></svg>`;
    assignTabItem('Bookmarks', '/watched/threads?tab=bookmarks', ['fa--xf', 'far', 'fa-bookmark'], fontAwesomeSVG, 2);
  }

  /*Removes all effects from tiles on Latest Update Page
   by removing all event listeners from tiles*/
  function removeTileHoverEffects() {
    Edexal.runOnLatestUpdatePage(() => {
      const tilesWrapper = Edexal.$(SELECTOR.latestUpdate);
      const tilesWrapperClone = tilesWrapper.cloneNode();
      tilesWrapperClone.append(...tilesWrapper.childNodes);
      const fragment = document.createDocumentFragment();
      fragment.append(tilesWrapperClone);
      tilesWrapper.replaceWith(fragment);
    });
  }

  function stickyNavBar() {
    Edexal.runOnLatestUpdatePage(() => {
      modifyHeaderLinks();
      preventScrollAfterClose();
      scrollToOptionsPanel();
    });
  }

  function modifyHeaderLinks() {
    const headerNav = Edexal.$("ul.p-nav-list");
    for (let i = 0; i < 2; i++) {
      headerNav.children.item(0).remove();// removes 'DOWNLOADS' & 'FORUMS'
    }
    headerNav.children[0].firstElementChild.classList.add("headList");// style 'SEARCH'
  }

  function preventScrollAfterClose() {
    const closeBtn = Edexal.$("#filter-close");
    Edexal.on(closeBtn, "click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const filterDrawer = Edexal.$(SELECTOR.latestFilterDrawer);
      filterDrawer.classList.add("filter-hidden");
      setTimeout(() => filterDrawer.style.display = "none", 250);
      document.body.style.overflow = "hidden scroll";
    });
  }

  function scrollToOptionsPanel() {
    const optionsBtn = Edexal.$("#controls_toggle-options-panel");
    Edexal.on(optionsBtn, 'click', () => {
      window.scroll(0, 200);
    });
  }
  
  function removeEl(selector, useParent) {
    const el = Edexal.$(selector);
    if (el) {
      useParent ? el.parentElement.remove() : el.remove();
    }
  }

  function removeAdBanner() {
    removeEl('#tn7k9m2x');
  }
  
  function removeStickyReviewWidget() {
    removeEl('footer ~ div .f95rv-banner', true);
  }
  
  function reorderLeftDrawer(records, obs) {
    const leftDrawer = Edexal.$('.offCanvasMenu-list');
    if (!leftDrawer) {
      obs.disconnect();
      return;
    }
    for (const elItem of leftDrawer.children) {
      const a = elItem.querySelector('a');
      if (a && a.href.includes('latest_alpha')) {
        leftDrawer.prepend(elItem);
        obs.disconnect();
        return;
      }
    }
  }
  function initLeftDrawerOrder() {
    const observer = new MutationObserver(reorderLeftDrawer);
    observer.observe(Edexal.$('.offCanvasMenu-content .sidePanel__tabPanel .js-offCanvasNavTarget'), {subtree:true, childList: true});
  }

  function run() {
    //Run only on mobile
    if (Edexal.$("html").clientWidth > MAX_SCREEN_WIDTH) return;
    const autoLabelRemover = new BMAutoLabelRemover();
    initTabItems();
    initScrollBtns();
    autoLabelRemover.start();
    setTimeout(removeTileHoverEffects, 2000);
    removeAdBanner();
    setTimeout(removeStickyReviewWidget, 1800);
    stickyNavBar();
    initLeftDrawerOrder();
  }

  run();
})()