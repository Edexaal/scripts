// ==UserScript==
// @name         F95 Random Bookmark Picker
// @namespace    1330126-edexal
// @license      Unlicense
// @version      2.1.2
// @description  Randomly picks a bookmark from your f95 bookmark page.
// @author       Edexal
// @match        *://f95zone.to/watched/threads?tab=bookmarks*
// @icon         https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant        GM.xmlhttpRequest
// @homepageURL  https://sleazyfork.org/en/scripts/490810-f95-random-bookmark-picker
// @supportURL   https://github.com/Edexaal/scripts/issues
// @require      https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// @require      https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/gm-utility.js
// ==/UserScript==
(() => {
  'use strict';
  Edexal.addCSS(`
  #ed-rand-sect {
    & > div, & > li {
      background: #242629;
      outline: 2px solid #8c2d2d;
    }
    & > li {
      list-style: none;
    }
    & > button {
      color: yellow;
      background: linear-gradient(to top left, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.2) 30%, rgb(0 0 0 / 0)) #ba4545;
      text-align: center;
      width: 100%;
      border-radius: 10px;
      font-weight: bold;
      margin-top: 10px;
      transition: opacity .2s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
          opacity: 0.8;
          cursor: pointer;
          border-color: #9adc49;
      }
    }
  }
  `);
  const EL = {
    pageNav:'.pageNav ul li:last-child a', 
    bookmarks: '.p-body-pageContent .structItemContainer > div, ol.listPlain > li',
    chosenSect: "#ed-rand-sect > div, #ed-rand-sect > li"
  };
  const GLOBAL = {prevPageNum: null, prevBMIndex: null, cachePages: {}};
  
  function isGamesOrPostsOnlyPage() {
    return location.search.includes('bm=games') || location.search.includes('bm=posts');
  }
  
  function distinctRandomNumInc(min, max, globalObjName) {
    if (max <= min) return min;
    let pageNum;
    do {
      pageNum = Edexal.getRandIntInc(min, max);
    } while (pageNum === GLOBAL[globalObjName]);
    GLOBAL[globalObjName] = pageNum;
    return pageNum;
  }

  function getRandomPageNum() {
    const lastPage = Edexal.$(EL.pageNav); 
    const totalPages = !lastPage ? 1 : +lastPage.textContent;  // converts to Number
    return distinctRandomNumInc(1, totalPages, 'prevPageNum');
  }
  
  function getPageAsync(pageNum) {
    const url = new URL(location.href);
    url.searchParams.set('page', pageNum);
    return EdexalGM.getAsync(url.href);
  }
  
  function chooseBM(bmEls) {
    const chosenNum = distinctRandomNumInc(0, bmEls.length - 1, 'prevBMIndex');
    const chosenBM = bmEls[chosenNum].cloneNode(true);
    Edexal.$(EL.chosenSect).replaceWith(chosenBM);
  }
  
  async function randomBMEvent() {
    try {
      const pageNum = getRandomPageNum();
      let bookmarkEls = GLOBAL.cachePages[pageNum];
      if (!GLOBAL.cachePages[pageNum]) {
        const res = await getPageAsync(pageNum);
        bookmarkEls = res.response.querySelectorAll(EL.bookmarks);
        GLOBAL.cachePages[pageNum] = bookmarkEls;
      }
      chooseBM(bookmarkEls);
    } catch(err) {
      console.error(err);
    }
  }
  
  function addRandSection() {
    const container = Edexal.newEl({element: 'div', class: ['block'], id: 'ed-rand-sect'});
    let chosenSect = Edexal.$(EL.bookmarks);
    if (!chosenSect) return;
    chosenSect = chosenSect.cloneNode(true);
    if (chosenSect.nodeName === 'LI') {
      chosenSect.querySelector('label').remove();
    }
    const btn = Edexal.newEl({element: 'button', text: 'Random'});
    Edexal.on(btn, 'click', async () => await randomBMEvent());
    container.append(chosenSect, btn);
    Edexal.$('form.block').before(container);
  }
  
  function run() {
    if (!isGamesOrPostsOnlyPage()) return;
    addRandSection();
  }
  run();
})();
