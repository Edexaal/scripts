// ==UserScript==
// @name        F95 Quick Game Templates
// @namespace   1330126-edexal
// @match       *://f95zone.to/forums/game-requests.3/post-thread*
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant       none
// @version     1.5.1
// @author      Edexal
// @license     Unlicense
// @description Adds more action buttons to the toolbar when making a game request on f95.
// @homepageURL https://sleazyfork.org/en/scripts/500283-f95-quick-game-templates
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@20abbf4a49807e7d11a081eb3a8573d0cab83c1f/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@20abbf4a49807e7d11a081eb3a8573d0cab83c1f/_lib/game-request-templates.js
// ==/UserScript==
(() => {
  const TAG_PAGE = "https://f95zone.to/threads/tags-rules-and-list-updated-2024-01-29.10394";
  Edexal.addCSS(`
    .edexal-btn{
        color:yellow !important;
    }
    `);
  const NEW_STANDARD_TEMPLATE = getNewStandardTempl();
  const NEW_VNDB_TEMPLATE = getNewVNDBTempl();
  const REQ_TEMPLATE = getRequestTempl();
  const UPDATE_TEMPLATE = getUpdateTempl();

  function addButton() {
    let toolbarEl = Edexal.$('.fr-toolbar');
    toolbarEl.insertAdjacentHTML('beforeend', `<div class="fr-separator fr-vs" role="separator" aria-orientation="vertical"></div>
      <button aria-controls="dropdown-menu-xfTemp-1" aria-expanded="false" aria-haspopup="false" class="fr-command fr-btn fr-dropdown fr-btn-font_awesome edexal-btn" data-cmd="xfTemp"
              id="xfTemp-1" role="button" tabindex="-1"
              type="button" title="Templates">
          <i aria-hidden="true" class="fas fa-file-word"></i>
          <span class="fr-sr-only">Templates</span>
      </button>
      <div aria-hidden="true" aria-labelledby="xfTemp-1" class="fr-dropdown-menu" id="dropdown-menu-xfTemp-1" role="listbox">
          <div class="fr-dropdown-wrapper" role="presentation">
              <div class="fr-dropdown-content" role="presentation">
                  <ul class="fr-dropdown-list" role="presentation">
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempStandard" role="option"
                                                 tabindex="-1" title="${NEW_STANDARD_TEMPLATE.label}">${NEW_STANDARD_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempVNDB" role="option"
                                                 tabindex="-1" title="${NEW_VNDB_TEMPLATE.label}">${NEW_VNDB_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempRequest" role="option"
                                                 tabindex="-1" title="${REQ_TEMPLATE.label}">${REQ_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempUpdate" role="option"
                                                 tabindex="-1" title="${UPDATE_TEMPLATE.label}">${UPDATE_TEMPLATE.label}</a></li>
                  </ul>
              </div>
          </div>
      </div>
      <button id="xfTagList-1" title="Go To Tag List" type="button" tabindex="-1" role="button" class="fr-command fr-btn fr-btn-xf_font_awesome_5 edexal-btn" data-cmd="xfTagList"><i class="far fa-tags" aria-hidden="true"></i><span class="fr-sr-only">Go To Tag List</span></button>`);
  }

  function refreshTextArea() {
    let textAreaEl = Edexal.$(".fr-element") //Text Area Element
    textAreaEl.replaceChildren();//Text Area Element
    let preEl = Edexal.newEl({element:"pre"});
    textAreaEl.append(preEl); //Text Area Element
  }

  function displayTextClick(e, template) {
    refreshTextArea();
    let txt = document.createTextNode(template.body);
    Edexal.$(".fr-element").firstElementChild.append(txt); //Text Area Element
    Edexal.$('#xfTemp-1').classList.remove('fr-active', 'fr-selected');
    e.target.classList.remove('fr-selected');
    Edexal.$('[placeholder~=title]').value = template.title; //Thread title Element
  }
  function setBtnEvent(templateObj) {
    const el = Edexal.$(`[title="${templateObj.label}"]`);
    Edexal.on(el,'click',(e) => displayTextClick(e, templateObj));
  }

  function goToTagListClick() {
    window.open(TAG_PAGE);
  }

  function displayPrefixPlaceholder() {
    const prefixField = Edexal.$('.select2-search__field');
    prefixField.placeholder = "*DON'T FORGET TO SELECT THE PREFIX TAG HERE!!!";
  }

  function run() {
    addButton();
    displayPrefixPlaceholder();

    setBtnEvent(NEW_STANDARD_TEMPLATE);
    setBtnEvent(NEW_VNDB_TEMPLATE);
    setBtnEvent(REQ_TEMPLATE);
    setBtnEvent(UPDATE_TEMPLATE);
    const tagIcon = Edexal.$('#xfTagList-1');
    Edexal.on(tagIcon,'click',(e) => goToTagListClick(e));
  }

  function startOnTime() {
    const observer = new MutationObserver(() => {
      const toolbar = Edexal.$('.fr-toolbar');
      if (toolbar) {
        run();
        observer.disconnect();
      }
    });
    observer.observe(document.body, {subtree: true, childList: true});
  }

  startOnTime();
})();
