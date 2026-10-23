// ==UserScript==
// @name        F95 Mobile Upgrade
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.8.16
// @author      Edexal
// @description Improves mobile experience
// @homepageURL https://sleazyfork.org/en/scripts/546346-f95-mobile-upgrade
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@17861f671a93a6a1d41b8864391e3e37fac59e8f/_lib/utility.js
// ==/UserScript==
(async () => {
  // NOTE: F95 uses FontAwesome v5.15.4
  const SELECTOR = {
    likeBtns: 'a.reaction.actionBar-action',
    reactionBtns: 'button.reaction.actionBar-action',
    thread: '.p-body-main',
    latestUpdate: '#latest-page_main-wrap',
    latestFilterDrawer: '#latest-page_filter-wrap',
  };
  let REACTION_BAR;
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
      gap:10px;
      bottom: 60px;
      left: 45vw;
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
  /*Styles for reactions*/
  button.reaction.actionBar-action {
    position: relative;
    cursor: pointer;
  }
  .reactTooltip {
    position: absolute;
    bottom: 30px;
    right: -70px;
    width: 180px;
    z-index: 5;
    background-color: #242629;
    border: 1px solid #343638;
    border-radius: 8px;
    max-width: unset;
    gap: 2px;
  }
   .actionBar .reaction.reaction--imageHidden.reaction--1 i {
      padding-right: 0;
      margin-right: 0;
  }
  .reaction.reaction--imageHidden img {
    display: unset;
  }
  .reaction.reaction--imageHidden > img {
    display: none;
  }
  .reaction-text {
    margin-left: 6px;
  }
  .has-reaction .reaction-text {
    margin-left: 0;
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
}`);

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

    const aBottomButton = Edexal.newEl({
      element: 'a',
      href: '#footer',
      class: ['button--scroll', 'ripple-JsOnly', 'button']
    });
    const spanBottomText = Edexal.newEl({element: 'span', class: ['button-text']});
    const iBottom = Edexal.newEl({element: 'i', class: ['fa--xf', 'far', 'fa-arrow-down'], "aria-hidden": "true"});
    const spanBottomSR = Edexal.newEl({element: 'span', class: ['u-srOnly'], text: 'Bottom'});

    Edexal.on(aTopButton, 'click', (e) => {
      e.preventDefault();
      const target = Edexal.$(topTargets[0]) ?? Edexal.$(topTargets[1]);
      target.scrollIntoView({
        block: 'start'
      });
    });
    Edexal.on(aBottomButton, 'click', (e) => {
      e.preventDefault();
      const target = Edexal.$(bottomTargets[0]) ?? Edexal.$(bottomTargets[1]);
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
    const bottomTargets = ['div.block-outer:nth-child(4) > div:nth-child(1) > nav:nth-child(1) > div:nth-child(2)', '#footer.p-footer'];
    const topTargets = ['.block--messages', '#top'];
    const hasNewBtn = setScrollBtn('.uix_fabBar .u-scrollButtons a:last-child',
      bottomTargets[0],
      'end',
      bottomTargets[1]);
    if (hasNewBtn) {
      setScrollBtn('.uix_fabBar .u-scrollButtons a:first-child',
        topTargets[0],
        'start',
        topTargets[1]);
    } else {
      const footer = Edexal.$("#footer.p-footer");
      const scrollBtnDiv = createCustomScrollBtns(topTargets, bottomTargets);
      footer.insertAdjacentElement('afterend', scrollBtnDiv);
    }
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
    let fontAwesomeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M336 0H48C21.49 0 0 21.49 0 48v464l192-112 192 112V48c0-26.51-21.49-48-48-48zm0 428.43l-144-84-144 84V54a6 6 0 0 1 6-6h276c3.314 0 6 2.683 6 5.996V428.43z"/></svg>`;
    assignTabItem('Latest Updates', '/sam/latest_alpha/', ['fa--xf', 'far', 'fa-gem'], fontAwesomeSVG, 1);
    fontAwesomeSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0zm-19.3 48l63.3 96h-68.4l-51.7-96h56.8zm-202.1 0h90.7l51.7 96H191l51.6-96zm-111.3 0h56.8l-51.7 96H68l63.3-96zm-43 144h51.4L208 352 88.3 192zm102.9 0h193.6L288 435.3 191.2 192zM368 352l68.2-160h51.4L368 352z"/></svg>`;
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

  function createReaction(idNum, altName) {
    const a = Edexal.newEl({
      element: 'a',
      href: `/posts/10864040/react?reaction_id=${idNum}`,
      class: ['reaction', `reaction--${idNum}`],
      'data-reaction-id': idNum
    });
    const img = Edexal.newEl({
      element: 'img',
      src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      class: ['reaction-sprite', 'js-reaction'],
      alt: altName,
      title: altName,
      'data-extra-class': "tooltip--basic tooltip--noninteractive",
      'data-delay-in': 50,
      'data-delay-out': 50
    });
    a.append(img);
    return a;
  }

  function createReactionBar() {
    const divBar = Edexal.newEl({element: 'div', class: ['reactTooltip']});
    let reactions = [
      createReaction(1, 'Like'),
      createReaction(14, 'Heart'),
      createReaction(13, "Jizzed my pants"),
      createReaction(12, "Yay, update!"),
      createReaction(3, "Haha"),
      createReaction(9, "Hey there"),
      createReaction(4, "Wow"),
      createReaction(7, "Thinking Face"),
      createReaction(5, "Sad"),
      createReaction(18, "Disagree"),
      createReaction(8, "Angry")
    ];
    divBar.append(...reactions);
    REACTION_BAR = divBar;
  }

  function initReactionBtns(likeBtns) {
    for (const likeBtn of likeBtns) {
      let reactBtn;
      if (!likeBtn.classList.contains('has-reaction')) {
        reactBtn = Edexal.newEl({
          element: 'button',
          'data-post-id': likeBtn.getAttribute('data-th-react-plus-content-id')
        });
        likeBtn.classList.remove('reaction--small');
      } else {
        reactBtn = Edexal.newEl({element: 'a', href: likeBtn.href});
      }
      reactBtn.classList.add(...likeBtn.classList);
      reactBtn.append(...likeBtn.childNodes);
      likeBtn.replaceWith(reactBtn);
    }
  }

  function updateReactionBtnURLs(postId) {
    REACTION_BAR.querySelectorAll('a').forEach(el => {
      el.href = el.href.replace(/\/[0-9]+\//, `/${postId}/`);
    });
  }

  function addReactionBarEvent(e) {
    updateReactionBtnURLs(e.currentTarget.dataset.postId);
    e.currentTarget.append(REACTION_BAR);
  }

  function removeReactionBarEvent(e) {
    if (!e.target.closest(SELECTOR.reactionBtns)) {
      REACTION_BAR.remove();
    }
  }

  function addReactionBtnEvents() {
    const reactionBtns = Edexal.$$(SELECTOR.reactionBtns);
    for (const reactBtn of reactionBtns) {
      Edexal.on(reactBtn, 'click', addReactionBarEvent);
    }
  }

  function setRemoval() {
    const thread = Edexal.$(SELECTOR.thread);
    Edexal.on(thread, 'click', removeReactionBarEvent);
  }

  function initReaction() {
    const likeBtns = Edexal.$$(SELECTOR.likeBtns);
    if (!likeBtns || !likeBtns.length) return;
    createReactionBar();
    initReactionBtns(likeBtns);
    addReactionBtnEvents();
    setRemoval();
  }

  function removeBookmarkFilter() {
    setTimeout(() => {
      const filterMenuActive = Edexal.$("div.menu.is-active");
      if (!filterMenuActive) return;
      const filterBtnClose = Edexal.$(".select2-selection__choice__remove");
      if (!filterBtnClose) return;
      filterBtnClose.click();
    }, 200);
  }

  function initBookmarkLabel() {
    Edexal.runOnBookmarkPage(() => {
      const filtersLink = Edexal.$(".f95wg-labelMenu .menuTrigger");
      Edexal.on(filtersLink, "click", removeBookmarkFilter);
    });
  }

  function removeAdBanner() {
    const banner = Edexal.$('#tn7k9m2x');
    if (banner) {
      banner.remove();
    }
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

  function run() {
    //Run only on mobile
    if (Edexal.$("html").clientWidth > MAX_SCREEN_WIDTH) return;
    initTabItems();
    initScrollBtns();
    initReaction();
    initBookmarkLabel();
    setTimeout(removeTileHoverEffects, 2000);
    removeAdBanner();
    initImageGallery();
    stickyNavBar();
  }

  run();
})()