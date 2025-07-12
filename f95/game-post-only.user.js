// ==UserScript==
// @name        F95 Game Post Only
// @namespace   1330126-edexal
// @match       *://f95zone.to/threads/*
// @grant       GM.setValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     3.2
// @author      Edexal
// @description Display only the 1st post of a game thread. This completely removes all replies (and more) from the thread.
// @homepageURL https://sleazyfork.org/en/scripts/522360-f95-game-post-only
// @supportURL  https://github.com/Edexal/monkey-scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@ff38688cdb9d3399ebd443775790422961c5dcae/_lib/utility.js
// ==/UserScript==
(async () => {
  const labels = {
    breadcrumbs: 'breadcrumbs',
    footer: 'footer',
    reply: 'reply',
    recommend: 'recommend',
    account: 'account',
    navbar: 'navbar',
    close: 'close'
  };
  //Apply custom styles in a style tag
  const styleCSS = `
    #vm-gpo {
      position: fixed;
	    top: 15vh;
	    right: 1vw;
      z-index: 999999;

      div.tooltip-content-inner {
        display:flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 10px;
      }
      h2 {
        margin-bottom: 0;
        text-shadow: 1px 2px 3px rgb(0 0 0 / 0.6),
        2px 4px 5px rgb(0 0 0 / 0.33),
        3px 6px 7px rgb(0 0 0 / 0.1);
      }
      ul {
          width: 100%;
          padding: 0;
        li {
          list-style: none;
          text-align: center;
          input {
            opacity: 0;
            position: absolute;
            top: 0vh;
          }
          label {
            display: block;
            font-size: 1.5rem;
            color: yellow;
            padding: 0.625rem 0;
            border-radius: 8px;
            border: 1px solid black;
            transition: opacity 375ms, transform 125ms;
            &[for="close"] {
              color: #ffcb00;
            }
          }
        }
      }

    }

    #vm-gpo {
      label{
        &:hover {
          cursor: pointer;
          background-color: #822626;
        }
        &[for="close"]:hover {
          background-color: #622;
        }
        &:active {
          transform: scale(0.9);
        }

      }
    }
    #vmgpo-icon {
      color: yellow;
      &:hover {
        color: #f5a3a3;
      }
    }
    .tooltip--vmgpo {
      max-width: 100%;
      width: 280px;
      padding: 0 15px;
    }
    .tooltip--vmgpo .tooltip-content {
        background-color: #242629;
        padding: 0;
        border: 1px solid #343638;
        box-shadow: 0 5px 10px 0 rgba(0,0,0,0.35);
    }

    .vmgpo-active {
      background-color: #822626;
      &:hover{
        opacity: 0.6;
      }
    }
    .p-footer {
      z-index: auto;
    }
    @media screen and (max-width: 650px) {
      #vm-gpo{
        top: 220px;
      }
    }
    @media screen and (max-width: 357px){
      #vm-gpo{
        top: 260px;
      }
    }
  `;

  function createList(name, metaName, classNames) {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.setAttribute("for", metaName);
    if (!!classNames) {
      label.classList.add(...classNames);
    }
    if (!!name) {
      const txtNode = document.createTextNode(name);
      label.append(txtNode);
    }


    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = metaName;
    checkbox.id = metaName;
    li.append(label, checkbox);
    return li;
  }

  function createTooltip() {
    const vmGPO = document.createElement("div");
    vmGPO.id = "vm-gpo";
    vmGPO.classList.add("tooltip", "tooltip--vmgpo");

    const vmGPOContent = document.createElement("div");
    vmGPOContent.classList.add("tooltip-content");

    const vmGPOInner = document.createElement("div");
    vmGPOInner.classList.add("tooltip-content-inner");

    const h2 = document.createElement("h2");
    const h2TxtNode = document.createTextNode("Game Post Settings");
    h2.append(h2TxtNode);

    const ul = document.createElement("ul");
    const breadcrumbLI = createList("Breadcrumbs", labels.breadcrumbs);
    const footerLI = createList("Footer", labels.footer);
    const recommendLI = createList("Recommendations", labels.recommend);
    const replyLI = createList("Reply", labels.reply);
    const accountLI = createList("Account Items", labels.account);
    const navbarLI = createList("Navigation Bar", labels.navbar);
    const closeLI = createList("", labels.close, ['fas', 'fa-times-circle']);

    ul.append(closeLI, breadcrumbLI, footerLI, recommendLI, replyLI, accountLI, navbarLI);
    vmGPOInner.append(h2, ul);
    vmGPOContent.append(vmGPOInner);
    vmGPO.append(vmGPOContent);
    document.querySelector("header.message-attribution").append(vmGPO);
  }

  function createIcon() {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = "#";
    a.title = "Game post settings";
    const span = document.createElement('span');
    span.classList.add("fas", "fa-cog");
    span.id = "vmgpo-icon";
    a.append(span);
    li.append(a);
    document.querySelector('.message-attribution-opposite--list').prepend(li);
  }

  function setClickEvent(selector, callback) {
    document.querySelector(selector).addEventListener('click', callback);
  }

  function setLabelEvent(labelName, callback) {
    setClickEvent(`label[for="${labelName}"]`, callback);
  }

  function showSettingsEvent(e) {
    document.querySelector('#vm-gpo').style.display = "initial";
  }

  function closeSettingsEvent(e) {
    document.querySelector('#vm-gpo').style.display = "none";
  }

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

  function toggleEvent(el, callback) {
    const isActive = el.classList.toggle("vmgpo-active");
    if (isActive) {
      GM.setValue(el.getAttribute('for'), true);
      callback();
    } else {
      GM.deleteValue(el.getAttribute('for'));
    }
  }

  function removeFooter() {
    let footer = document.querySelector("#footer.p-footer");
    deleteEls(footer);
  }

  function removeFooterEvent(e) {
    toggleEvent(e.target, () => {
      removeFooter();
    });
  }

  function removeBreadcrumbs() {
    let breadcrumb = document.querySelectorAll(".breadcrumb");
    deleteEls(breadcrumb);
  }

  function removeBreadcrumbsEvent(e) {
    toggleEvent(e.target, () => {
      removeBreadcrumbs();
    });
  }

  function removeAccountItems() {
    let accIcon = document.querySelector("a.p-navgroup-link--user, .offCanvasMenu");
    deleteEls(accIcon);
  }

  function removeAccountItemsEvent(e) {
    toggleEvent(e.target, () => {
      removeAccountItems();
    });
  }

  function removeReplyItems() {
    let replyForm = document.querySelector('form.js-quickReply');
    !!replyForm ? deleteEls(replyForm) : null;

    let replyActions = document.querySelectorAll('a.actionBar-action--mq,  a.actionBar-action--reply');
    !!replyActions ? deleteEls(replyActions) : null;
  }

  function removeReplyItemsEvent(e) {
    toggleEvent(e.target, () => {
      removeReplyItems();
    });
  }

  function removeRecomendations() {
    let recomendationSection = document.querySelector('div.block--similarContents');
    !!recomendationSection ? deleteEls(recomendationSection) : null;
  }

  function removeRecomendationsEvent(e) {
    toggleEvent(e.target, () => {
      removeRecomendations();
    });
  }

  function removePagination() {
    let paginations = document.querySelectorAll('.pageNavWrapper--mixed');
    if (!!!paginations.length) return;
    //top pagination
    let topPageContainer = paginations[0].parentNode.parentNode;
    !!topPageContainer ? deleteEls(topPageContainer) : null;

    //bottom pagination
    let bottomPageContainer = paginations[1].parentNode.parentNode;
    !!bottomPageContainer ? deleteEls(bottomPageContainer) : null;
  }

  function removeScrollbarBtns() {
    let scrollbarContainer = document.querySelector('div.u-scrollButtons').parentNode;
    !!scrollbarContainer ? deleteEls(scrollbarContainer) : null;
  }

  function removeNavbar() {
    let navbar = document.querySelector('div#top > div:first-child');
    deleteEls(navbar);
  }

  function removeNavbarEvent(e) {
    toggleEvent(e.target, () => {
      removeNavbar();
    });
  }

  function removeThreadWarning() {
    let warningBlock = document.querySelector('div.blockMessage.blockMessage--warning');
    deleteEls(warningBlock);
  }

  function showFirstPostOnly() {
    //Thread Post Container Ref
    let opContainer = document.querySelector("article.message-threadStarterPost").parentNode;
    opContainer.replaceChildren(opContainer.children.item(0));
    removePagination();
    removeScrollbarBtns();
    removeThreadWarning();
  }

  async function initSettings() {
    const keys = await GM.listValues();
    for (const labelName of keys) {
      const labelEl = document.querySelector(`label[for="${labelName}"]`);
      labelEl.classList.add('vmgpo-active');
      switch (labelName) {
        case labels.breadcrumbs:
          removeBreadcrumbs();
          break;
        case labels.footer:
          removeFooter();
          break;
        case labels.reply:
          removeReplyItems();
          break;
        case labels.recommend:
          removeRecomendations();
          break;
        case labels.account:
          removeAccountItems();
          break;
        case labels.navbar:
          removeNavbar();
          break;
      }
    }
  }

  function isGameThread() {
    let breadcrumbID = document.querySelectorAll("ul.p-breadcrumbs li:nth-of-type(3) a span[itemprop=name]");
    let isGame = false;
    if (!!breadcrumbID.length) {
      breadcrumbID.forEach((curVal, curIndex) => {
        if (curVal.textContent.toLowerCase() === "Games".toLowerCase()) {
          isGame = true;
        }
      });
    }
    return isGame;
  }

  /*Checks if thread is a GAME type*/
  if (isGameThread()) {
    edexal.applyCSS(styleCSS);
    createIcon();
    createTooltip();
    initSettings();
    showFirstPostOnly();//
    setClickEvent('#vmgpo-icon', showSettingsEvent);
    setLabelEvent(labels.breadcrumbs, removeBreadcrumbsEvent);
    setLabelEvent(labels.footer, removeFooterEvent);
    setLabelEvent(labels.recommend, removeRecomendationsEvent);
    setLabelEvent(labels.reply, removeReplyItemsEvent);
    setLabelEvent(labels.account, removeAccountItemsEvent);
    setLabelEvent(labels.navbar, removeNavbarEvent);
    setLabelEvent(labels.close, closeSettingsEvent);
  }

})();
