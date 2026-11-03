// ==UserScript==
// @name        F95 Mobile Upgrade
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     2.2.0
// @author      Edexal
// @description Improves mobile experience
// @homepageURL https://sleazyfork.org/en/scripts/546346-f95-mobile-upgrade
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/bm-utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/css.js
// ==/UserScript==
(async () => {
  // NOTE: F95 uses FontAwesome v7
  const SELECTOR = {
    latestUpdate: '#latest-page_main-wrap',
    latestFilterDrawer: '#latest-page_filter-wrap',
  };
  const MAX_SCREEN_WIDTH = 480;
  Edexal.addCSS(`
@media (width <= ${MAX_SCREEN_WIDTH}px) {
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
        display: inherit;
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
  ${EdexalCSS.bmScrollLabelMenu()}
  
  /* Set bookmark icon in side menu(left drawer)*/
  .offCanvasMenu--nav .offCanvasMenu-content .offCanvasMenu-link[data-nav-id="Bookmarks"]::before {
    content: "\\f02e";
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
  
  function addBMToLeftDrawer(leftDrawer,latestUpdateList) {
    const bookmarkList = latestUpdateList.cloneNode(true);
    const a = bookmarkList.querySelector('a');
    a.href = `${location.origin}/watched/threads?tab=bookmarks`;
    const bmLabel = 'Bookmarks';
    a.dataset.navId = bmLabel;
    const span = a.querySelector('span');
    span.textContent = bmLabel;
    leftDrawer.prepend(bookmarkList);
  }
  
  function observeLeftDrawer(records, obs) {
    const leftDrawer = Edexal.$('.offCanvasMenu-list');
    if (!leftDrawer) {
      obs.disconnect();
      return;
    }
    for (const elItem of leftDrawer.children) {
      const a = elItem.querySelector('a');
      if (a && a.href.includes('latest_alpha')) {
        leftDrawer.prepend(elItem); // Reorder latest Update
        addBMToLeftDrawer(leftDrawer, elItem);
        obs.disconnect();
        return;
      }
    }
  }
  
  function initLeftDrawer() {
    const observer = new MutationObserver(observeLeftDrawer);
    observer.observe(Edexal.$('.offCanvasMenu-content .sidePanel__tabPanel .js-offCanvasNavTarget'), {subtree:true, childList: true});
  }

  function run() {
    //Run only on mobile
    if (Edexal.$("html").clientWidth > MAX_SCREEN_WIDTH) return;
    const autoLabelRemover = new BMAutoLabelRemover();
    initScrollBtns();
    autoLabelRemover.start();
    setTimeout(removeTileHoverEffects, 2000);
    removeAdBanner();
    stickyNavBar();
    initLeftDrawer();
  }

  run();
})()