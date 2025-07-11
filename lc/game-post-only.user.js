// ==UserScript==
// @name        LC Game Post Only
// @namespace   1330126-edexal
// @match       *://lewdcorner.com/threads/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/lewdcorner.com.ico
// @license     Unlicense
// @version     2.0
// @author      Edexal
// @description Display only the 1st post of a game thread. This completely removes all replies (and more) from the thread.
// @homepageURL https://sleazyfork.org/en/scripts/522359-lc-game-post-only
// @supportURL  https://github.com/Edexal/monkey-scripts/issues
// ==/UserScript==
(() => {
  function deleteEls(el) {
    if (el instanceof NodeList) {
      el.forEach((curVal, curIndex) => {
        curVal.remove();
      });
    } else if (el instanceof Element) {
      el.remove();
    } else {
      console.error(`Unable to delete ${el}! Element is of type: ${typeof el}.`);
    }

  }

  function removeFooter() {
    let footer = document.querySelector("#footer");
    deleteEls(footer);
  }

  function removeNotices() {
    let notices = document.querySelectorAll(".notices");
    deleteEls(notices);
  }

  function removeBreadcrumbs() {
    let breadcrumb = document.querySelector(".p-breadcrumbs--container");
    deleteEls(breadcrumb);
  }

  function removeAccountItems() {
    let accountDetails = document.querySelectorAll(".p-navgroup-link--user, [data-nav-id*=user], div.p-offCanvasAccountLink");
    deleteEls(accountDetails);
  }

  function removeReplyItems() {
    let replyForm = document.querySelector('form.js-quickReply');
    !!replyForm ? deleteEls(replyForm) : null;

    let replyActions = document.querySelectorAll('a.actionBar-action--mq,  a.actionBar-action--reply');
    !!replyActions ? deleteEls(replyActions) : null;
  }

  function removeRecomendations() {
    let recomendationSection = document.querySelector('div[data-widget-key*=similar_threads]');
    !!recomendationSection ? deleteEls(recomendationSection) : null;
  }

  function removeShareWidget() {
    let shareWidget = document.querySelector('div.shareButtons').parentNode;
    !!shareWidget ? deleteEls(shareWidget) : null;
  }

  function removeNavbar() {
    let navbar = document.querySelector('header#header + div');
    deleteEls(navbar);
  }

  function removePagination() {
    let paginations = document.querySelectorAll('.pageNavWrapper--mixed');
    if (!!!paginations.length)
      return;
    //top pagination
    let topPageContainer = paginations[0].parentNode.parentNode;
    !!topPageContainer ? deleteEls(topPageContainer) : null;

    //bottom pagination
    let bottomPageContainer = paginations[1].parentNode.parentNode;
    !!bottomPageContainer ? deleteEls(bottomPageContainer) : null;
  }

  function showFirstPostOnly() {
    //Thread Post Container Ref
    let opContainer = document.querySelector("article.message-threadStarterPost").parentNode;
    opContainer.replaceChildren(opContainer.children.item(0));
    removePagination();
  }

  /*Checks if thread is a GAME type*/
  if (!!document.querySelectorAll('.labelLink[href*=games]').length) {
    showFirstPostOnly();
    /*-----------------------(Optional) Delete '//' for each option to activate----------------*/
    removeAccountItems();//Removes account related elements from the page (including hidden ones)
    removeBreadcrumbs();
    removeNotices();
    removeFooter();
    removeRecomendations();//Removes the similar threads section at the bottom of the page
    removeReplyItems();//Removes reply related elements from the page
    removeShareWidget();
    //removeNavbar();//Removes navigation bar at the top of the page
  }
})();
