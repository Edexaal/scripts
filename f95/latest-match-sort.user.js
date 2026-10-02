// ==UserScript==
// @name        F95 Latest Match-based Sort
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       GM.setValue
// @grant       GM.getValues
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.2
// @author      Edexal
// @description Sorts resources on Latest Update page: top -> most-important; bottom -> least relevant.
// @homepageURL https://sleazyfork.org/en/scripts/598317-f95-latest-match-based-sort
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3852ea334ad4c2280f459a04f10e2638b9e90010/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3852ea334ad4c2280f459a04f10e2638b9e90010/_lib/metadata.js
// ==/UserScript==
(async () => {
  Edexal.addCSS(`
  #filter-block_match  {
    padding: 0;
    border-top: 1px solid #3f4043;
    & div ul{
      list-style: none;
      color: white;
      padding: 0;
    }
    & div:first-child {
      overflow: unset;
    }
    & h4 {
      color: #fc9b46 !important;
    }
    & hr {
      color: #c15858;
    }
  }
  #match-list {
    background-color: rgb(36,38,41);
    & div:first-child {
      background-color: rgb(19,21,23);
      border: 1px solid #333029;
      color: yellow;
      text-align: center;
      padding-top: 5px;
      padding-bottom: 5px;
      text-decoration: underline;
      font-weight: bold;
    }
    & div:last-child {
      & ul {
        height: 10em;
        overflow-y: scroll;
      }
      & ul li {
        padding-left: 20px;
        padding-bottom: 10px;
        &:hover {
          background-color: rgb(55,56,58);
          cursor: pointer;
        }
      }
    }
  }
  #match-tags {
    background-color: rgb(36,38,41);
    & ul li {
      display: flex;
      align-items: center;
      border: 1pt solid rgb(60, 61, 67);
      & button {
        flex: 1;
        font: bold 1.1em Arial, Verdana, sans-serif;
        background-color: #A3002C;
        color: #f9f920;
        padding: inherit;
        height: 30px;
        margin: 0;
        transition: 150ms opacity ease;
        &:hover {
          cursor: pointer;
          opacity: 0.9;
        }
        &:active {
          opacity: 0.8;
        }
        &::after {
            content: "[x]";
            color: inherit;
            margin-left: 8px;
        }
      }
    }
  }
  .ed-hide {
    display: none;
  }
  .ed-show {
    display: block !important;
  }
  `);
  let CONFIG = {category: {}, matches: null, pList: [], saveTimerID:null, saveDelay: 2000, newPageTimerID:null, newPageDelay: 1500};
  const CSS_SELECT = {matchList: "#match-list div:last-child ul", matchTags: "#match-tags ul", latestWrapper: "#latest-page_items-wrap_inner",
                      navPageBar:"#sub-nav_inner .sub-nav_paging", includeFilter: '#filter-block_tags .selectize-input',matchSect: '#filter-block_match',
                      latestResources:'div.resource-tile',lTileTags:'div.resource-tile .resource-tile_label-wrap_left',rTileTags:'div.resource-tile .resource-tile_label-wrap_right'};
  const INVALID_CATEGORY_TAGS = new Set(['mods']);
  const EXTRA_TAGS = {watch: 'x1'};

  function showMatchListItem(tagCode,shouldHide) {
    const matchListItem = Edexal.$(`${CSS_SELECT.matchList} li[data-tag-code="${tagCode}"]`);
    if (!matchListItem) {
      return;
    }
    const className = 'ed-hide';
    if (shouldHide) {
      matchListItem.classList.add(className);
    } else {
      matchListItem.classList.remove(className);
    }
  }

  function updateMatchConfigList(tagCode) {
    CONFIG.matches.delete(tagCode);
    CONFIG.pList.push(tagCode);
  }

  function saveUserPriorities() {
    if (CONFIG.saveTimerID) {
      clearTimeout(CONFIG.saveTimerID);
    }
    CONFIG.saveTimerID = setTimeout(async () => {
      await GM.setValue('matches', Array.from(CONFIG.matches));
    }, CONFIG.saveDelay);
  }

  function matchTagsCount(dataArr) {
    return dataArr.reduce((accumVal, currentVal) => CONFIG.matches.has(currentVal) ? accumVal + 1 : accumVal, 0);
  }
  
  function hasWatchIconCount(el) {
    if (!CONFIG.matches.has(EXTRA_TAGS.watch)) {
      return 0;
    }
    return el.querySelector('i.watch-icon') ? 1 : 0;
  }
  function flatTagObject(tagCodeObj) {
    let tempObj = {};
    for (const name in tagCodeObj) {
      if (name === 'basic'){
        continue;
      }
      tempObj = {...tempObj, ...tagCodeObj[name]};
    }
    return tempObj;
  }
  
  function getExtraTags() {
    let obj = {};
    switch(CONFIG.cat_loc) {
      case "comics":
        obj = flatTagObject(TAG_CODE.comic);
        break;
      case "animations":
        obj = flatTagObject(TAG_CODE.animation);
        break;
      case "assets":
        obj = flatTagObject(TAG_CODE.asset);
        break;
      default:
        obj = flatTagObject(TAG_CODE.game);
        break;
    }
    return Object.assign(obj, EXTRA_TAGS);
  }
  
  function countTiles(tileEls,extraTags) {
    let count = 0;
    for (const tileEl of tileEls) {
      const tagName = tileEl.textContent.toLowerCase();
      if (CONFIG.matches.has(extraTags[tagName])){
        count += 1;
      }
    }
    return count;
  }
  
  // Collection, engines, types, statuses, medias
  function TileCount(el) {
    const extraTags = getExtraTags();
    delete extraTags.watch; // watch is handled by 'hasWatchIconCount()'
    const leftTiles = el.querySelector(CSS_SELECT.lTileTags).children;
    const rightTiles = el.querySelector(CSS_SELECT.rTileTags).children;
    return countTiles(leftTiles, extraTags) + countTiles(rightTiles, extraTags);
  }
  
  function calculateTotalCount(el) {
    const basicTagsArr = el.dataset.tags.split(',');
    return matchTagsCount(basicTagsArr) + hasWatchIconCount(el) + TileCount(el);
  }
  
  function organizeResources() {
    const latestWrapper = Edexal.$(CSS_SELECT.latestWrapper);
    const latestUpdatesArr = Array.from(latestWrapper.querySelectorAll(CSS_SELECT.latestResources));
    const sortedArr = latestUpdatesArr.toSorted((a,b) => {
      const aMatchCount = calculateTotalCount(a);
      const bMatchCount = calculateTotalCount(b);
      if (aMatchCount > bMatchCount) {
        return -1;
      } else if(aMatchCount < bMatchCount) {
        return 1;
      } else {
        return 0;
      }
    });
    latestWrapper.append(...sortedArr);
  }

  function attachRemoveMatchEvent(btnEl) {
    Edexal.on(btnEl,'click', (e) => {
      const liTag = e.target.parentElement;
      const tagCode = liTag.dataset.tagCode;
      updateMatchConfigList(tagCode);
      liTag.remove(liTag);
      showMatchListItem(tagCode, false);
      organizeResources();
      saveUserPriorities();
    });
  }

  function updateMatchConfigTags(tagCode) {
    const matchIndex = CONFIG.pList.indexOf(tagCode);
    CONFIG.matches.add(tagCode);
    if (matchIndex !== -1) {
      CONFIG.pList.splice(matchIndex, 1);
    }
  }

  function addChosenMatchTag(listEl){
    const matchTagsEl = Edexal.$(CSS_SELECT.matchTags);
    const li = Edexal.newEl({'element': 'LI', 'data-tag-code': listEl.dataset.tagCode});
    const btn = Edexal.newEl({'element': 'BUTTON', 'text': listEl.textContent, 'type': 'button'});
    attachRemoveMatchEvent(btn);
    li.append(btn);
    matchTagsEl.append(li);
    updateMatchConfigTags(listEl.dataset.tagCode);
    showMatchListItem(listEl.dataset.tagCode, true);
  }

  function applyChoiceEvent(matchListEl) {
    Edexal.on(matchListEl,'click', (e) => {
      if (e.target.classList.contains('ed-hide') || e.target.tagName.toLowerCase() !== 'li') {
        return;
      }
      addChosenMatchTag(e.target);
      organizeResources();
      saveUserPriorities();
    });
  }
  
  function addTagToSettings(tagName, tagCode, matchListEl) {
    const isInMatches = CONFIG.matches.has(tagCode);
      if (!isInMatches) {
        CONFIG.pList.push(tagCode);
      }
      const li = Edexal.newEl({
          element: 'LI',
          text: tagName,
          'data-tag-code': tagCode
      });
      matchListEl.append(li);
      if (isInMatches) {
        addChosenMatchTag(li);
      }
  }
  
  function addExtraTags(matchListEl) {
    const extraTags = getExtraTags();
    for (const tagName in extraTags) {
      const tagCode = extraTags[tagName];
      CONFIG.category[tagName] = tagCode;
      addTagToSettings(tagName, tagCode, matchListEl);
    }
  }
  
  function addTagsToSettings() {
    const dropDownTags = Edexal.$$('#filter-block_tags .selectize-dropdown-content .option');
    const matchList = Edexal.$(CSS_SELECT.matchList);
    addExtraTags(matchList);
    dropDownTags.forEach((el) => {
      //Ex: '2d game' : 1112
      const tagName = el.querySelector('span:first-child').textContent;
      CONFIG.category[tagName] = el.dataset.value;
      addTagToSettings(tagName, el.dataset.value, matchList);
    });
    applyChoiceEvent(matchList);
    organizeResources();
  }

  function observeCallback2(records,obs) {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.classList?.contains('option')) {
          obs.disconnect();
          addTagsToSettings();
          return;
        }
      }
    }
  }

  function addSettingSection() {
    const filterBarEl = Edexal.$(".content-block_filter");
    const html = `
    <div id="filter-block_match">
      <div class="filter-block accordion-block">
        <h4 class="filter-block_title accordion-toggle">Match Sorting</h4>
        <div class="filter-block_content filter-block_v accordion-content">
          <div id="match-list">
            <div>Select tags...</div>
            <div>
              <ul></ul>
            </div>
          </div>
          <hr/>
          <div id="match-tags">
            <ul></ul>
          </div>
        </div>
      </div>
  </div>`;
    filterBarEl.insertAdjacentHTML('beforeEnd', html);
  }

  function addSettingEvent() {
    const settingSect = Edexal.$('#filter-block_match');
    Edexal.on(settingSect, 'click', (e) => {
      if (e.target.matches('h4')) {
        settingSect.querySelector('div.accordion-content').classList.toggle('ed-show');
      }
    });
  }

  function runOnTagReveal() {
    const observer = new MutationObserver((records, obs) => observeCallback2(records,obs));
    observer.observe(Edexal.$('#filter-block_tags .selectize-dropdown-content'), {subtree: true, childList: true});
  }

  // Procs loading of all tags for current category
  function procTagLoading() {
    Edexal.$(CSS_SELECT.includeFilter).click();
  }

  function initTagChoices() {
    procTagLoading();
    runOnTagReveal();
  }

  function clearMatchLists() {
    const listEl = Edexal.$(CSS_SELECT.matchList);
    listEl.replaceChildren();
    const tagListEl = Edexal.$(CSS_SELECT.matchTags);
    tagListEl.replaceChildren();
  }

  function nextCategoryPage(curCategory) {
    CONFIG.cat_loc = curCategory;
    CONFIG.category = {};
    CONFIG.pList = [];
    clearMatchLists();
    initTagChoices();
  }

  function categoryPageType() {
    let curCatLoc = location.href.match(/cat=(\w+)/);
    return curCatLoc ? curCatLoc[1] : 'games';
  }

  function observePageChange(records, obs) {
    const curCat = categoryPageType();
    if (CONFIG.newPageTimerID || INVALID_CATEGORY_TAGS.has(curCat)) {
      return;
    }
    CONFIG.newPageTimerID = setTimeout(() => {
      CONFIG.cat_loc === curCat ?
        organizeResources() : nextCategoryPage(curCat);
      CONFIG.newPageTimerID = null;
    }, CONFIG.newPageDelay);
  }

  function organizeOnNewPages() {
    const observer = new MutationObserver((records, obs) => observePageChange(records, obs));
    observer.observe(Edexal.$(CSS_SELECT.navPageBar), {attributeFilter: ['class']});
  }

  function initSettings() {
    addSettingSection();
    addSettingEvent();
    initTagChoices();
    organizeOnNewPages();
  }

  function observeCallback(records, obs) {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.classList?.contains('resource-tile')) {
          obs.disconnect();
          initSettings();
          return;
        }
      }
    }
  }

  async function loadDB(curCatLoc){
    const dbObj = await GM.getValues({'cat_loc': '', 'matches': []});
    dbObj.matches = new Set(dbObj.matches);
    CONFIG = Object.assign(CONFIG, dbObj);
    CONFIG.cat_loc = curCatLoc;
    await GM.setValue('cat_loc', curCatLoc);
  }

  async function initOnResourceLoad() {
    const curCatLoc = categoryPageType();
    if (INVALID_CATEGORY_TAGS.has(curCatLoc)) {
      return;
    }
    await loadDB(curCatLoc);
    const latestUpdateWrapper = Edexal.$(CSS_SELECT.latestWrapper);
    const observer = new MutationObserver((records, obs) => observeCallback(records, obs));
    observer.observe(latestUpdateWrapper, {subtree: true, childList: true});
  }
  await initOnResourceLoad();
})();