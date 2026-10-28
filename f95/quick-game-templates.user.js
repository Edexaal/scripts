// ==UserScript==
// @name        F95 Quick Game Templates
// @namespace   1330126-edexal
// @match       *://f95zone.to/forums/game-requests.3/post-thread*
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant       none
// @version     1.6.2
// @author      Edexal
// @license     Unlicense
// @description Adds more action buttons to the toolbar when making a game request on f95.
// @homepageURL https://sleazyfork.org/en/scripts/500283-f95-quick-game-templates
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@23f86bce8d8c88bc66704d0971ba7eb11be92caa/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@23f86bce8d8c88bc66704d0971ba7eb11be92caa/_lib/game-request-templates.js
// ==/UserScript==
(() => {
  const TAG_PAGE = "https://f95zone.to/threads/tags-rules-and-list-updated-2026-06-29.10394/";
  Edexal.addCSS(`
    .edexal-btn{
        color:yellow !important;
    }
    `);
  const NEW_STANDARD_TEMPLATE = getNewStandardTempl();
  const NEW_VNDB_TEMPLATE = getNewVNDBTempl();
  const REQ_TEMPLATE = getRequestTempl();
  const REQ_VNDB_TEMPLATE = getRequestVNDBTempl();
  const UPDATE_TEMPLATE = getUpdateTempl();

  function addButton() {
    let toolbarEl = Edexal.$('.fr-toolbar');
    const toolBtnGroups = toolbarEl.querySelectorAll(".fr-float-left");
    toolBtnGroups[toolBtnGroups.length - 1].insertAdjacentHTML('beforeend', `
      <button aria-controls="dropdown-menu-xfTemp-1" aria-expanded="false" aria-haspopup="true" class="fr-command fr-btn fr-dropdown fr-btn-font_awesome edexal-btn" data-cmd="xfTemp"
              id="xfTemp-1" role="button" tabindex="-1"
              type="button" data-title="Templates">
          <i class="fa--xf"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H305c7.7 0 13.4 7.1 11.7 14.7l-38 168c-1.2 5.5-6.1 9.3-11.7 9.3h-38c-5.5 0-10.3-3.8-11.6-9.1-25.8-103.5-20.8-81.2-25.6-110.5h-.5c-1.1 14.3-2.4 17.4-25.6 110.5-1.3 5.3-6.1 9.1-11.6 9.1H117c-5.6 0-10.5-3.9-11.7-9.4l-37.8-168c-1.7-7.5 4-14.6 11.7-14.6h24.5c5.7 0 10.7 4 11.8 9.7 15.6 78 20.1 109.5 21 122.2 1.6-10.2 7.3-32.7 29.4-122.7 1.3-5.4 6.1-9.1 11.7-9.1h29.1c5.6 0 10.4 3.8 11.7 9.2 24 100.4 28.8 124 29.6 129.4-.2-11.2-2.6-17.8 21.6-129.2 1-5.6 5.9-9.5 11.5-9.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"/></svg></i>
          <span class="fr-sr-only">Templates</span>
      </button>
      <div aria-hidden="true" aria-labelledby="xfTemp-1" class="fr-dropdown-menu" id="dropdown-menu-xfTemp-1" role="listbox">
          <div class="fr-dropdown-wrapper" role="presentation">
              <div class="fr-dropdown-content" role="presentation">
                  <ul class="fr-dropdown-list" role="presentation">
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempNew" role="option"
                                                 tabindex="-1" title="${NEW_STANDARD_TEMPLATE.label}">${NEW_STANDARD_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempNewVNDB" role="option"
                                                 tabindex="-1" title="${NEW_VNDB_TEMPLATE.label}">${NEW_VNDB_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempRequest" role="option"
                                                 tabindex="-1" title="${REQ_TEMPLATE.label}">${REQ_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempRequestVNDB" role="option"
                                                 tabindex="-1" title="${REQ_VNDB_TEMPLATE.label}">${REQ_VNDB_TEMPLATE.label}</a></li>
                      <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempUpdate" role="option"
                                                 tabindex="-1" title="${UPDATE_TEMPLATE.label}">${UPDATE_TEMPLATE.label}</a></li>
                  </ul>
              </div>
          </div>
      </div>
      <button id="xfTagList-1" title="Go To Tag List" type="button" tabindex="-1" role="button" class="fr-command fr-btn fr-btn-xf_font_awesome_5 edexal-btn" data-cmd="xfTagList"><i class="fa--xf" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M497.941 225.941L286.059 14.059A48 48 0 0 0 252.118 0H48C21.49 0 0 21.49 0 48v204.118a48 48 0 0 0 14.059 33.941l211.882 211.882c18.744 18.745 49.136 18.746 67.882 0l204.118-204.118c18.745-18.745 18.745-49.137 0-67.882zM112 160c-26.51 0-48-21.49-48-48s21.49-48 48-48 48 21.49 48 48-21.49 48-48 48zm513.941 133.823L421.823 497.941c-18.745 18.745-49.137 18.745-67.882 0l-.36-.36L527.64 323.522c16.999-16.999 26.36-39.6 26.36-63.64s-9.362-46.641-26.36-63.64L331.397 0h48.721a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882z"/></svg></i><span class="fr-sr-only">Go To Tag List</span></button>`);
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
    const prefixField = Edexal.$('.choices__input');
    const msg = "~ REMEMBER TO SELECT THE APPROPRIATE PREFIX TAG ~"
    prefixField.placeholder = msg;
    prefixField.ariaLabel = msg;
  }

  function run() {
    addButton();
    displayPrefixPlaceholder();

    setBtnEvent(NEW_STANDARD_TEMPLATE);
    setBtnEvent(NEW_VNDB_TEMPLATE);
    setBtnEvent(REQ_TEMPLATE);
    setBtnEvent(REQ_VNDB_TEMPLATE);
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
