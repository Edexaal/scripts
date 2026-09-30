// ==UserScript==
// @name        F95 Latest Priority Sort
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @grant       GM.setValue
// @grant       GM.getValues
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     0.1.0
// @author      Edexal
// @description Sorts resources on Latest Update page: top -> most-important; bottom -> least relevant.
// @homepageURL 
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@20abbf4a49807e7d11a081eb3a8573d0cab83c1f/_lib/utility.js
// ==/UserScript==
(async () => {
  Edexal.addCSS(`
  #filter-block_priority  {
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
  }
  #priority-list {
    background-color: rgb(36,38,41);
    & div:first-child {
      background-color: rgb(19,21,23);
      border: 1px solid #333029;
      color: yellow;
      text-align: center;
      padding-top: 5px;
      padding-bottom: 5px;
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
  #priority-tags {
    background-color: rgb(36,38,41);
    & ul li {
      display: flex;
      align-items: center;
      border: 1pt solid rgb(60, 61, 67);
      & p, & button {
        padding-left: 10px;
        padding-right: 10px;
        margin: 0;
      }
      & button {
        height: 30px;
        color: rgb(255, 116, 152);
        background-color: rgb(36,38,41);
        flex: 1 2 auto;
        &:hover {
          cursor: pointer;
          opacity: 0.9;
        }
        &:active {
          opacity: 0.8;
        }
      }
      & p {
        flex: 2 1 auto;
        &:hover {
          opacity: 0.7;
          cursor: pointer;
        }
        &:active {
          opacity: 0.5;
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
  let CONFIG = {category: {}, priority: null, pList: [], saveTimerID:null, saveDelay: 2000, newPageTimerID:null, newPageDelay: 1500};
  const CSS_SELECT = {priorityList: "#priority-list div:last-child ul", priorityTags: "#priority-tags ul", latestWrapper: "#latest-page_items-wrap_inner",
                      navPageBar:"#sub-nav_inner .sub-nav_paging", includeFilter: '#filter-block_tags .selectize-input',prioritySect: '#filter-block_priority',
                      latestResources:'div.resource-tile',lTileTags:'div.resource-tile .resource-tile_label-wrap_left',rTileTags:'div.resource-tile .resource-tile_label-wrap_right'};
  const SIMILAR_CATEGORY_TAGS = new Set(['games', 'comics', 'animations']);
  const INVALID_CATEGORY_TAGS = new Set(['mods']);
  const EXTRA_TAGS = {watch: 'x1', collection: 'x2'};
  const GAME_TAGS = {"ren'py": 'g7', "unreal engine": 'g31', rpgm: 'g2', unity: 'g3', flash: 'g8', godot: 'g116', html: 'g4', adrift: 'g12', java: 'g6',
  others: 'g14', qsp: 'g1', rags: 'g5', tads: 'g17', webgl: 'g47', "wolf rpg": 'g30', completed: 'g18', abandoned: 'g22', onhold: 'g20'};
  const COMIC_TAGS = {cg: 'c49',comics: 'c16',manga: 'c43',pinup: 'c44'};
  const ANIM_TAGS = {app: 'an59', video: 'an39', gif: 'an38', flash:'an37'};
  const ASSET_TAGS = {blender: 'as42',autodesk: 'as40',daz: 'as33',illusion: 'as36',other: 'as71',poser: 'as41',rpgm: 'as115',tutorial: 'as45',
  unity: 'as114',unreal: 'as110',vam: 'as35'};

  function showPriorityListItem(tagCode,shouldHide) {
    const priorityListItem = Edexal.$(`${CSS_SELECT.priorityList} li[data-tag-code="${tagCode}"]`);
    if (!priorityListItem) {
      return;
    }
    const className = 'ed-hide';
    if (shouldHide) {
      priorityListItem.classList.add(className);
    } else {
      priorityListItem.classList.remove(className);
    }
  }

  function updatePriorityConfigList(tagCode) {
    CONFIG.priority.delete(tagCode);
    CONFIG.pList.push(tagCode);
  }

  function saveUserPriorities() {
    if (CONFIG.saveTimerID) {
      clearTimeout(CONFIG.saveTimerID);
    }
    CONFIG.saveTimerID = setTimeout(async () => {
      await GM.setValue('priority', Array.from(CONFIG.priority));
    }, CONFIG.saveDelay);
  }

  function priorityMatchCount(dataArr) {
    return dataArr.reduce((accumVal, currentVal) => CONFIG.priority.has(currentVal) ? accumVal + 1 : accumVal, 0);
  }
  
  function hasWatchIconCount(el) {
    if (!CONFIG.priority.has(EXTRA_TAGS.watch)) {
      return 0;
    }
    return el.querySelector('i.watch-icon') ? 1 : 0;
  }
  
  function getExtraTags() {
    let obj = {};
    switch(CONFIG.cat_loc) {
      case "comics":
        obj = COMIC_TAGS;
        break;
      case "animations":
        obj = ANIM_TAGS;
        break;
      case "assets":
        obj = ASSET_TAGS;
        break;
      default:
        obj = GAME_TAGS;
        break;
    }
    return Object.assign(obj, EXTRA_TAGS);
  }
  
  function countTiles(tileEls,extraTags) {
    let count = 0;
    for (const tileEl of tileEls) {
      const tagName = tileEl.textContent.toLowerCase();
      if (CONFIG.priority.has(extraTags[tagName])){
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
    return priorityMatchCount(basicTagsArr) + hasWatchIconCount(el) + TileCount(el);
  }
  
  function organizeResources() {
    const latestWrapper = Edexal.$(CSS_SELECT.latestWrapper);
    const latestUpdatesArr = Array.from(latestWrapper.querySelectorAll(CSS_SELECT.latestResources));
    const sortedArr = latestUpdatesArr.toSorted((a,b) => {
      const aPriorityCount = calculateTotalCount(a);
      const bPriorityCount = calculateTotalCount(b);
      if (aPriorityCount > bPriorityCount) {
        return -1;
      } else if(aPriorityCount < bPriorityCount) {
        return 1;
      } else {
        return 0;
      }
    });
    latestWrapper.append(...sortedArr);
  }

  function attachRemovePriorityEvent(btnEl) {
    Edexal.on(btnEl,'click', (e) => {
      const liTag = e.target.parentElement;
      const tagCode = liTag.dataset.tagCode;
      updatePriorityConfigList(tagCode);
      liTag.remove(liTag);
      showPriorityListItem(tagCode, false);
      organizeResources();
      saveUserPriorities();
    });
  }

  function updatePriorityConfigTags(tagCode) {
    const priorityIndex = CONFIG.pList.indexOf(tagCode);
    CONFIG.priority.add(tagCode);
    if (priorityIndex !== -1) {
      CONFIG.pList.splice(priorityIndex, 1);
    }
  }

  function addChosenPriorityTag(listEl){
    const priorityTagsEl = Edexal.$(CSS_SELECT.priorityTags);
    const li = Edexal.newEl({'element': 'LI', 'data-tag-code': listEl.dataset.tagCode});
    const p = Edexal.newEl({'element': 'P', 'text': listEl.textContent});
    const btn = Edexal.newEl({'element': 'BUTTON', 'text': 'x', 'type': 'button'});
    attachRemovePriorityEvent(btn);
    li.append(p, btn);
    priorityTagsEl.append(li);
    updatePriorityConfigTags(listEl.dataset.tagCode);
    showPriorityListItem(listEl.dataset.tagCode, true);
  }

  function applyChoiceEvent(priorityListEl) {
    Edexal.on(priorityListEl,'click', (e) => {
      if (e.target.classList.contains('ed-hide') || e.target.tagName.toLowerCase() !== 'li') {
        return;
      }
      addChosenPriorityTag(e.target);
      organizeResources();
      saveUserPriorities();
    });
  }
  
  function addTagToSettings(tagName, tagCode, priorityListEl) {
    const isInPriority = CONFIG.priority.has(tagCode);
      if (!isInPriority) {
        CONFIG.pList.push(tagCode);
      }
      const li = Edexal.newEl({
          element: 'LI',
          text: tagName,
          'data-tag-code': tagCode
      });
      priorityListEl.append(li);
      if (isInPriority) {
        addChosenPriorityTag(li);
      }
  }
  
  function addExtraTags(priorityListEl) {
    const extraTags = getExtraTags();
    for (const tagName in extraTags) {
      const tagCode = extraTags[tagName];
      CONFIG.category[tagName] = tagCode;
      addTagToSettings(tagName, tagCode, priorityListEl);
    }
  }
  
  function addTagsToSettings() {
    const dropDownTags = Edexal.$$('#filter-block_tags .selectize-dropdown-content .option');
    const priorityList = Edexal.$(CSS_SELECT.priorityList);
    addExtraTags(priorityList);
    dropDownTags.forEach((el) => {
      //Ex: '2d game' : 1112
      const tagName = el.querySelector('span:first-child').textContent;
      CONFIG.category[tagName] = el.dataset.value;
      addTagToSettings(tagName, el.dataset.value, priorityList);
    });
    applyChoiceEvent(priorityList);
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
    <div id="filter-block_priority">
      <div class="filter-block accordion-block">
        <h4 class="filter-block_title accordion-toggle">Priority Sort</h4>
        <div class="filter-block_content filter-block_v accordion-content">
          <div id="priority-list">
            <div>Select tags...</div>
            <div>
              <ul></ul>
            </div>
          </div>
          <hr/>
          <div id="priority-tags">
            <ul></ul>
          </div>
        </div>
      </div>
  </div>`;
    filterBarEl.insertAdjacentHTML('beforeEnd', html);
  }

  function addSettingEvent() {
    const settingSect = Edexal.$('#filter-block_priority');
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

  function clearPriorityLists() {
    const listEl = Edexal.$(CSS_SELECT.priorityList);
    listEl.replaceChildren();
    const tagListEl = Edexal.$(CSS_SELECT.priorityTags);
    tagListEl.replaceChildren();
  }

  function nextCategoryPage(curCategory) {
    CONFIG.cat_loc = curCategory;
    CONFIG.category = {};
    CONFIG.pList = [];
    clearPriorityLists();
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
    const dbObj = await GM.getValues({'cat_loc': '', 'priority': []});
    dbObj.priority = new Set(dbObj.priority);
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