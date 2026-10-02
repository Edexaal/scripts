// ==UserScript==
// @name        F95 Reset Filters
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.6
// @author      Edexal
// @description Reset individual filters in the filter drawer on the latest update page.
// @homepageURL https://sleazyfork.org/en/scripts/588436-reset-filters
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3852ea334ad4c2280f459a04f10e2638b9e90010/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3852ea334ad4c2280f459a04f10e2638b9e90010/_lib/metadata.js
// ==/UserScript==
(async () => {
  const SELECTOR = {
    INCLUDE_TAGS: "#filter-block_tags",
    EXCLUDE_TAGS: "#filter-block_tags_exclude",
    PREFIXES: "#filter-block_prefixes div.filter-block div.filter-block_content",
    RESET_PREFIX_BTNS: "#filter-block_prefixes div.filter-block div.filter-block_content button"
  };
  const GAME_PREFIXES = [
    {name: "ed-engine_prefixes", codes: Object.values(TAG_CODE.game.engine)},
    {name: "ed-other_prefixes", codes: Object.values(TAG_CODE.game.other)},
    {name: "ed-status_prefixes", codes: Object.values(TAG_CODE.game.status)}
  ];
  const ANIM_PREFIXES = [
    {name: "ed-animation_prefixes", codes: Object.values(TAG_CODE.animation.animation)},
    {name: "ed-other_prefixes", codes: [GLOBAL_TAG_CODE.other.collection]}
  ];
  const ASSET_PREFIXES = [
    {name: "ed-assets_prefixes", codes: Object.values(TAG_CODE.asset.assets)},
    {name: "ed-other_prefixes", codes: [GLOBAL_TAG_CODE.other.collection]}
  ];
  const COMIC_PREFIXES = [
    {name: "ed-other_prefixes", codes: Object.values(TAG_CODE.comic.other)},
    {name: "ed-status_prefixes", codes: Object.values(TAG_CODE.comic.status)}
  ];
  Edexal.addCSS(`
  .ed-filter_btn {
    display: block;
    background: linear-gradient(to top left, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.2) 30%, rgb(0 0 0 / 0)) #ba4545;
    color: yellow;
    width: 100%;
    height: 35px;
    margin: 10px auto 5px auto;
    font-size: 0.875em;
    font-weight: bold;
    border: 1px solid #a4a4a4;
    border-radius: 5px;
    transition: opacity .2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    &:active {
        opacity: 0.6;
    }
}`);

  function addButton(containerEl, newBtnId, btnEvent) {
    const newBtn = Edexal.newEl({element: "button", class: ["ed-filter_btn"], id: newBtnId, text: "Reset"});
    Edexal.on(newBtn, 'click', btnEvent);
    containerEl.append(newBtn);
  }
  
  function getCurCategory() {
    let curCatLoc = location.href.match(/cat=(\w+)/);
    return curCatLoc ? curCatLoc[1] : 'games';
  }
  
  function addPrefixBtns(prefixDataArr) {
    const prefixContainers = Edexal.$$(SELECTOR.PREFIXES);
    prefixContainers.forEach((node, i) => {
      addButton(node, prefixDataArr[i].name, () => prefixResetEvent(new Set(prefixDataArr[i].codes)));
    });
  }
  
  function prefixBtnsExist(prefixArr) {
    const resetBtns = Edexal.$$(SELECTOR.RESET_PREFIX_BTNS);
    return resetBtns.length === prefixArr.length;
  }
  
  function initPrefixBtns() {
    let prefixArr;
    const categoryPage = getCurCategory();
    switch (categoryPage) {
      case "games":
        prefixArr = GAME_PREFIXES;
        break;
      case "comics":
        prefixArr = COMIC_PREFIXES;
        break;
      case "animations":
        prefixArr = ANIM_PREFIXES;
        break;
      case "assets":
        prefixArr = ASSET_PREFIXES;
        break;
      default:
        return;
    }
    if (prefixBtnsExist(prefixArr)) {
      return;
    }
    addPrefixBtns(prefixArr);
  }

  function initButtons() {
    addButton(Edexal.$(SELECTOR.INCLUDE_TAGS), 'ed-include_tags', () => tagResetEvent(/\/tags=(\d,?)+/, ''));
    addButton(Edexal.$(SELECTOR.EXCLUDE_TAGS), 'ed-exclude_tags', () => tagResetEvent(/\/notags=(\d,?)+/, ''));
    setTimeout(initPrefixBtns, 500);
  }

  function getNewPrefixURL(prefixSet, url, isPrefix) {
    const prefixPhrase = isPrefix ? "prefixes" : "noprefixes";
    const prefixRegex = new RegExp(`/${prefixPhrase}=\\d+(?:,\\d+)*`);
    const urlMatches = url.match(prefixRegex);
    const urlPrefix = urlMatches[0];
    const splitPrefix = urlPrefix.split('=');
    const urlPrefixNumbers = splitPrefix[1].split(',');
    const prefixesToKeep = [];
    for (const prefixNumber of urlPrefixNumbers) {
      if (!prefixSet.has(prefixNumber)) {
        prefixesToKeep.push(prefixNumber);
      }
    }
    if (!prefixesToKeep.length) {
      return url.replace(prefixRegex, '');
    }
    return url.replace(prefixRegex, `/${prefixPhrase}=${prefixesToKeep.join(',')}`);
  }

  function prefixResetEvent(prefixSet) {
    let url = location.href;
    if (url.includes("/prefixes=")) {
      url = getNewPrefixURL(prefixSet, url, true);
    }
    if (url.includes("/noprefixes=")) {
      url = getNewPrefixURL(prefixSet, url);
    }
    if (url !== location.href) {
      goToURL(url);
    }
  }

  function tagResetEvent(regex) {
    const newURL = location.href.replace(regex, '');
    goToURL(newURL);
  }

  function goToURL(url) {
    location.replace(url);
  }
  
  function observePageChanges() {
    const luObserver = new LUPageObserver();
    luObserver.observe(initPrefixBtns);
  }

  function run() {
    observePageChanges();
    initButtons();
  }

  run();
})();