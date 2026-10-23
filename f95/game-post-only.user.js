// ==UserScript==
// @name        F95 Game Post Only
// @namespace   1330126-edexal
// @match       *://f95zone.to/threads/*
// @grant       GM.setValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     4.1.1
// @author      Edexal
// @description Display only the 1st post of a game thread. Also, hide other content from the thread.
// @homepageURL https://sleazyfork.org/en/scripts/522360-f95-game-post-only
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3fcde43d7e7e48680ea5fb2715febcfd82058257/_lib/utility.js
// ==/UserScript==
(async () => {
  const labels = {
    breadcrumbs: 'breadcrumbs',
    footer: 'footer',
    reply: 'reply',
    recommend: 'recommend',
    account: 'account',
    navbar: 'navbar',
    rating: 'rating',
    version: 'version',
    scrollbtns: 'scrollbtns',
    first_post: 'first_post',
  };
  const CSS_HIDE = 'ed-hide';  // Hides/Shows DOM elements
  //Apply custom styles in a style tag
  Edexal.addCSS(`
    header.message-attribution {
      position: relative;
    }

    #vm-gpo {
      z-index: 999999;

      &.tooltip {
        top: 25px;
        right: 20px;
      }

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
            transition: opacity 375ms, transform 125ms, background-color .15s;
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
        &:active {
          transform: scale(0.9);
        }
      }
      & ul {
        overflow-y: auto;
        height:200px;
      }
    }
    #vmgpo-icon {
      color: yellow;
      transition: color .2s;
      &:hover {
        color: #f5a3a3;
        cursor: pointer;
      }
    }
    .tooltip--vmgpo {
      max-width: 100%;
      width: 250px;
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
    
    .ed-hide {
      display: none !important;
    }
  `);

  function createList(name, metaName, classNames) {
    const li = Edexal.newEl({element: "li"});
    const label = Edexal.newEl({element: "label", for: metaName});
    if (!!classNames) {
      label.classList.add(...classNames);
    }
    if (!!name) {
      const txtNode = document.createTextNode(name);
      label.append(txtNode);
    }


    const checkbox = Edexal.newEl({element: "input", type: "checkbox", name: metaName, id: metaName});
    li.append(label, checkbox);
    return li;
  }
  
  function labelSort(a,b) {
    return a.textContent.localeCompare(b.textContent);
  }

  function createTooltip() {
    const vmGPO = Edexal.newEl({element: "div", id: "vm-gpo", class: ["tooltip", "tooltip--vmgpo"]});

    const vmGPOContent = Edexal.newEl({element: "div", class: ["tooltip-content"]});

    const vmGPOInner = Edexal.newEl({element: "div", class: ["tooltip-content-inner"]});

    const h2 = Edexal.newEl({element: "h2", text: "Game Post Settings"});

    const ul = Edexal.newEl({element: "ul"});
    const liItems = [
      createList("Breadcrumbs", labels.breadcrumbs),
      createList("Footer", labels.footer),
      createList("Recommendations", labels.recommend),
      createList("Reply", labels.reply),
      createList("Account Items", labels.account),
      createList("Navigation Bar", labels.navbar),
      createList("First Post Only", labels.first_post),
      createList("Star Ratings", labels.rating),
      createList("Versioning", labels.version),
      createList("Scroll Buttons", labels.scrollbtns),
    ];
    liItems.sort(labelSort);

    ul.append(...liItems);
    vmGPOInner.append(h2, ul);
    vmGPOContent.append(vmGPOInner);
    vmGPO.append(vmGPOContent);
    Edexal.$(".message-attribution").append(vmGPO);
  }

  function createIcon(postHeaderEl) {
    const li = Edexal.newEl({element: 'li'});
    const span = Edexal.newEl({
      element: 'span',
      class: ['message-attribution-gadget'],
      id: "vmgpo-icon",
      title: "Game post settings"
    });
    const icon = Edexal.newEl({element: 'i', class: ["fa--xf","fas", "fa-cog"]});
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.5-5.5-.7-11.3-5.6-14.1zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>`;
    span.append(icon);
    li.append(span);
    postHeaderEl.prepend(li);
  }

  function setClickEvent(selector, callback) {
    Edexal.$(selector).addEventListener('click', callback);
  }

  function setLabelEvent(labelName, callback) {
    setClickEvent(`label[for="${labelName}"]`, callback);
  }

  function toggleSettingsEvent() {
    const menu = Edexal.$('#vm-gpo');
    menu.style.display = menu.style.display === 'initial' ? 'none' : 'initial';
  }
  
  function toggleVisibility(el) {
    if (el instanceof NodeList) {
      el.forEach((curVal) => {
        curVal.classList.toggle(CSS_HIDE);
      });
    } else if (el instanceof Element) {
      el.classList.toggle(CSS_HIDE);
    }
  }
  
  function toggleEvent(el, callback) {
    const isActive = el.classList.toggle("vmgpo-active");
    if (isActive) {
      GM.setValue(el.getAttribute('for'), true);
    } else {
      GM.deleteValue(el.getAttribute('for'));
    }
    callback();
  }
  
  function showHideRating() {
    toggleVisibility(Edexal.$(".p-body-header .pageContent .uix_headerInner--opposite"));
  }

  function showHideFooter() {
    toggleVisibility(Edexal.$("#footer.p-footer"));
  }

  function showHideBreadcrumbs() {
    toggleVisibility(Edexal.$$(".breadcrumb"));
  }

  function showHideAccountItems() {
    toggleVisibility(Edexal.$("a.p-navgroup-link--user, .offCanvasMenu"));
  }

  function showHideReplyItems() {
    let replyForm = Edexal.$('form.js-quickReply');
    toggleVisibility(replyForm);

    let replyActions = Edexal.$$('a.actionBar-action--mq,  a.actionBar-action--reply');
    toggleVisibility(replyActions);
    showHideThreadWarning();
  }

  function showHideRecomendations() {
    toggleVisibility(Edexal.$('div.block--similarContents'));
  }

  function showHidePagination() {
    let paginations = Edexal.$$('.pageNavWrapper--mixed');
    if (!!!paginations.length) return;
    paginations.forEach((el) => {
      const pageContainer = el.parentNode.parentNode;
      toggleVisibility(pageContainer);
    });
  }

  function showHideScrollbarBtns() {
    let scrollbarContainer = Edexal.$('div.u-scrollButtons').parentNode;
    toggleVisibility(scrollbarContainer);
  }

  function showHideNavbar() {
    toggleVisibility(Edexal.$('div#top div.p-navSticky'));
  }

  function showHideThreadWarning() {
    toggleVisibility(Edexal.$('div.blockMessage.blockMessage--warning'));
  }
  
  function showHideThreadVersion() {
    toggleVisibility(Edexal.$('div.f95wg-thread'));
  }

  function showFirstPostOnly() {
    //Thread Post Container Ref
    const opContainer = Edexal.$("article.message-threadStarterPost").parentNode;
    const replyPosts = opContainer.querySelectorAll('article.message--post:nth-child(n+2)');
    toggleVisibility(replyPosts);
    showHidePagination();
  }

  async function initSettings() {
    const keys = await GM.listValues();
    for (const labelName of keys) {
      const labelEl = Edexal.$(`label[for="${labelName}"]`);
      if (labelEl){
        labelEl.classList.add('vmgpo-active');
      }
      switch (labelName) {
        case labels.first_post:
          showFirstPostOnly();
          break;
        case labels.breadcrumbs:
          showHideBreadcrumbs();
          break;
        case labels.footer:
          showHideFooter();
          break;
        case labels.reply:
          showHideReplyItems();
          break;
        case labels.recommend:
          showHideRecomendations();
          break;
        case labels.account:
          showHideAccountItems();
          break;
        case labels.navbar:
          showHideNavbar();
          break;
        case labels.rating:
          showHideRating();
          break;
        case labels.version:
          showHideThreadVersion();
          break;
        case labels.scrollbtns:
          showHideScrollbarBtns();
          break;
        default:
         await GM.deleteValue(labelName);
         break;
      }
    }
  }

  function isGameThread() {
    let breadcrumbID = Edexal.$$("ul.p-breadcrumbs li:nth-of-type(2) a span[itemprop=name]");
    let isGame = false;
    if (!!breadcrumbID.length) {
      breadcrumbID.forEach((curVal) => {
        if (curVal.textContent.toLowerCase() === "Games".toLowerCase()) {
          isGame = true;
        }
      });
    }
    return isGame;
  }
  
  function isFirstPost(postHeaderEl) {
    if (!postHeaderEl) {
      return false;
    }
    const postNum = postHeaderEl.querySelector('li:last-child a').textContent;
    return postNum.trim() === '#1';
  }
  
  function run() {
    /*Checks if thread is a GAME type*/
    Edexal.runOnGameThread(async () => {
      const postHeaderEl = Edexal.$('article.message-threadStarterPost ul.message-attribution-opposite--list');
      if (!isFirstPost(postHeaderEl)){
        return;
      }
      createIcon(postHeaderEl);
      createTooltip();
      await initSettings();
      setClickEvent('#vmgpo-icon', toggleSettingsEvent);
      setLabelEvent(labels.first_post, (e) => toggleEvent(e.target, showFirstPostOnly));
      setLabelEvent(labels.breadcrumbs, (e) => toggleEvent(e.target, showHideBreadcrumbs));
      setLabelEvent(labels.footer, (e) => toggleEvent(e.target, showHideFooter));
      setLabelEvent(labels.recommend, (e) => toggleEvent(e.target, showHideRecomendations));
      setLabelEvent(labels.reply, (e) => toggleEvent(e.target, showHideReplyItems));
      setLabelEvent(labels.account, (e) => toggleEvent(e.target, showHideAccountItems));
      setLabelEvent(labels.navbar, (e) => toggleEvent(e.target, showHideNavbar));
      setLabelEvent(labels.rating, (e) => toggleEvent(e.target, showHideRating));
      setLabelEvent(labels.version, (e) => toggleEvent(e.target, showHideThreadVersion));
      setLabelEvent(labels.scrollbtns, (e) => toggleEvent(e.target, showHideScrollbarBtns));
    });
  }
  run();
})();
