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
// @homepageURL https://sleazyfork.org/en/scripts/522360-f95-game-post-only
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
  .ed-select {
    border: 2pt solid yellow !important;
    font-weight: bold;
  }
  `);
  let CONFIG = {category: {}, priority: null, pList: [], swapItem1: null, saveTimerID:null, saveDelay: 2000, newPageTimerID:null, newPageDelay: 1500};
  const CSS_SELECT = {priorityList: "#priority-list div:last-child ul", priorityTags: "#priority-tags ul", latestWrapper: "#latest-page_items-wrap_inner",
                      navPageBar:"#sub-nav_inner .sub-nav_paging", includeFilter: '#filter-block_tags .selectize-input',prioritySect: '#filter-block_priority'};
  const SIMILAR_CATEGORY_TAGS = new Set(['games', 'comics', 'animations']);
  const INVALID_CATEGORY_TAGS = new Set(['mods']);

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

  async function saveUserPriorities() {
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

  function organizeResources() {
    const latestWrapper = Edexal.$(CSS_SELECT.latestWrapper);
    const latestUpdatesArr = Array.from(latestWrapper.querySelectorAll('div.resource-tile'));
    const sortedArr = latestUpdatesArr.toSorted((a,b) => {
      const aTagsArr = a.dataset.tags.split(',');
      const bTagsArr = b.dataset.tags.split(',');
      const aPriorityCount = priorityMatchCount(aTagsArr);
      const bPriorityCount = priorityMatchCount(bTagsArr);
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

  async function attachRemovePriorityEvent(btnEl) {
    btnEl.addEventListener('click', async (e) => {
      const liTag = e.target.parentElement;
      const tagCode = liTag.dataset.tagCode;
      updatePriorityConfigList(tagCode);
      liTag.remove(liTag);
      showPriorityListItem(tagCode, false);
      organizeResources();
      await saveUserPriorities();
    });
  }

  function attachSwapEvent(pEl) {
    pEl.addEventListener('click', (e) => {
      const className = 'ed-select';
      if (!CONFIG.swapItem1) {
        CONFIG.swapItem1 = e.target;
        CONFIG.swapItem1.parentElement.classList.add(className);
      } else if (CONFIG.swapItem1 === e.target) {
        CONFIG.swapItem1.parentElement.classList.remove(className);
        CONFIG.swapItem1 = null;
      } else {
        const curTagName = e.target.textContent;
        e.target.parentElement.dataset.tagCode = CONFIG.swapItem1.parentElement.dataset.tagCode;
        e.target.textContent = CONFIG.swapItem1.textContent;

        CONFIG.swapItem1.textContent = curTagName;
        CONFIG.swapItem1.parentElement.dataset.tagCode = CONFIG.category[curTagName];

        CONFIG.swapItem1.parentElement.classList.remove(className);
        CONFIG.swapItem1 = null;
      }
    });
  }

  function updatePriorityConfigTags(tagCode) {
    const priorityIndex = CONFIG.pList.indexOf(tagCode);
    CONFIG.priority.add(tagCode);
    if (priorityIndex !== -1) {
      CONFIG.pList.splice(priorityIndex, 1);
    }
  }

  async function addChosenPriorityTag(listEl){
    const priorityTagsEl = Edexal.$(CSS_SELECT.priorityTags);
    const li = Edexal.newEl({'element': 'LI', 'data-tag-code': listEl.dataset.tagCode});
    const p = Edexal.newEl({'element': 'P', 'text': listEl.textContent});
    const btn = Edexal.newEl({'element': 'BUTTON', 'text': 'x', 'type': 'button'});
    attachSwapEvent(p);
    await attachRemovePriorityEvent(btn);
    li.append(p, btn);
    priorityTagsEl.append(li);
    updatePriorityConfigTags(listEl.dataset.tagCode);
    showPriorityListItem(listEl.dataset.tagCode, true);
  }

  async function applyChoiceEvent(priorityListEl) {
    priorityListEl.addEventListener('click', async (e) => {
      if (e.target.classList.contains('ed-hide') || e.target.tagName.toLowerCase() !== 'li') {
        return;
      }
      await addChosenPriorityTag(e.target);
      organizeResources();
      await saveUserPriorities();
    });
  }

  async function addTagsToSettings() {
    const dropDownTags = Edexal.$$('#filter-block_tags .selectize-dropdown-content .option');
    const priorityList = Edexal.$(CSS_SELECT.priorityList);
    dropDownTags.forEach(async (el) => {
      //Ex: '2d game' : 1112
      const tagName = el.querySelector('span:first-child').textContent;
      CONFIG.category[tagName] = el.dataset.value;
      const isInPriority = CONFIG.priority.has(el.dataset.value);
      if (!isInPriority) {
        CONFIG.pList.push(el.dataset.value);
      }
      const li = Edexal.newEl({
          element: 'LI',
          text: tagName,
          'data-tag-code': el.dataset.value
      });
      priorityList.append(li);
      if (isInPriority) {
        await addChosenPriorityTag(li);
      }
    });
    await GM.setValue('category', CONFIG.category);
    await applyChoiceEvent(priorityList);
    organizeResources();
  }

  async function observeCallback2(records,obs) {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.classList?.contains('option')) {
          obs.disconnect();
          await addTagsToSettings();
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
    settingSect.addEventListener('click', (e) => {
      if (e.target.matches('h4')) {
        settingSect.querySelector('div.accordion-content').classList.toggle('ed-show');
      }
    });
  }

  function runOnTagReveal() {
    const observer = new MutationObserver(async (records, obs) => await observeCallback2(records,obs));
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

  async function addSavedTagsToSettings() {
    const priorityList = Edexal.$(CSS_SELECT.priorityList);
    for (const [tagName, tagCode] of Object.entries(CONFIG.category)) {
      const isInPriority = CONFIG.priority.has(tagCode);
      if (!isInPriority) {
        CONFIG.pList.push(tagCode);
      }
      const li = Edexal.newEl({
          element: 'LI',
          text: tagName,
          'data-tag-code': tagCode,
      });
      priorityList.append(li);
      if (isInPriority) {
        await addChosenPriorityTag(li);
      }
    }
    await applyChoiceEvent(priorityList);
    organizeResources();
  }

  async function supplyTagChoices() {
    if (Object.keys(CONFIG.category).length > 0) {
      await addSavedTagsToSettings();
    }else {
      initTagChoices();
    }
  }

  function clearPriorityLists() {
    const listEl = Edexal.$(CSS_SELECT.priorityList);
    listEl.replaceChildren();
    const tagListEl = Edexal.$(CSS_SELECT.priorityTags);
    tagListEl.replaceChildren();
  }

  async function nextCategoryPage(curCategory) {
    if (SIMILAR_CATEGORY_TAGS.has(CONFIG.cat_loc) && SIMILAR_CATEGORY_TAGS.has(curCategory)) {
      CONFIG.cat_loc = curCategory;
      organizeResources();
      return;
    }
    CONFIG.cat_loc = curCategory;
    CONFIG.category = {};
    CONFIG.pList = [];
    clearPriorityLists();
    initTagChoices();
  }

  function categoryPageType() {
    let curCatLoc = location.href.match(/cat=(\w+)/);
    return curCatLoc = curCatLoc ? curCatLoc[1] : 'games';
  }

  async function observePageChange(records, obs) {
    const curCat = categoryPageType();
    if (CONFIG.newPageTimerID || INVALID_CATEGORY_TAGS.has(curCat)) {
      return;
    }
    CONFIG.newPageTimerID = setTimeout(async () => {
      CONFIG.cat_loc === curCat ?
        organizeResources() : await nextCategoryPage(curCat);
      CONFIG.newPageTimerID = null;
    }, CONFIG.newPageDelay);
  }

  function organizeOnNewPages() {
    const observer = new MutationObserver(async (records, obs) => await observePageChange(records, obs));
    observer.observe(Edexal.$(CSS_SELECT.navPageBar), {attributeFilter: ['class']});
  }

  async function initSettings() {
    addSettingSection();
    addSettingEvent();
    await supplyTagChoices();
    organizeOnNewPages();
  }

  async function observeCallback(records, obs) {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.classList?.contains('resource-tile')) {
          obs.disconnect();
          await initSettings();
          return;
        }
      }
    }
  }

  function shouldRenewCategory(curCatLoc) {
    let shouldRenew = true;
    if (curCatLoc === CONFIG.cat_loc) {
      shouldRenew = false;
    } else if (Object.keys(CONFIG.category).length > 0) {
      if (SIMILAR_CATEGORY_TAGS.has(CONFIG.cat_loc) && SIMILAR_CATEGORY_TAGS.has(curCatLoc)) {
        shouldRenew = false;
      }
    }
    return shouldRenew;
  }

  async function loadDB(curCatLoc){
    const dbObj = await GM.getValues({'category': {}, 'cat_loc': '', 'priority': []});
    dbObj.priority = new Set(dbObj.priority);
    CONFIG = Object.assign(CONFIG, dbObj);
    if (shouldRenewCategory(curCatLoc)) {
      CONFIG.cat_loc = curCatLoc;
      await GM.setValue('cat_loc', curCatLoc);
      CONFIG.category = {};
    }
  }

  async function initOnResourceLoad() {
    const curCatLoc = categoryPageType();
    if (INVALID_CATEGORY_TAGS.has(curCatLoc)) {
      return;
    }
    await loadDB(curCatLoc);
    const latestUpdateWrapper = Edexal.$(CSS_SELECT.latestWrapper);
    const observer = new MutationObserver(async (records,obs) => await observeCallback(records,obs));
    observer.observe(latestUpdateWrapper, {subtree: true, childList: true});
  }
  await initOnResourceLoad();
})();