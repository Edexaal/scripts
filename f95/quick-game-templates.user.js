// ==UserScript==
// @name        F95 Quick Game Templates
// @namespace   1330126-edexal
// @match       *://f95zone.to/forums/game-requests.3/post-thread*
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant       none
// @version     1.6.7
// @author      Edexal
// @license     Unlicense
// @description Adds more action buttons to the toolbar when making a game request on f95.
// @homepageURL https://sleazyfork.org/en/scripts/500283-f95-quick-game-templates
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/game-request-templates.js
// ==/UserScript==
(() => {
  const TAG_PAGE = "https://f95zone.to/threads/tags-rules-and-list-updated-2026-06-29.10394/";
  Edexal.addCSS(`
    .edexal-btn{
        color:yellow !important;
    }
    button#xfTemp-1 {
      padding-left: 6px;
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
          <i class="fa--xf fa-solid fa-file-word"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg></i>
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
      <button id="xfTagList-1" title="Go To Tag List" type="button" tabindex="-1" role="button" class="fr-command fr-btn fr-btn-xf_font_awesome_5 edexal-btn" data-cmd="xfTagList"><i class="fa--xf fa-solid fa-tags" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--! Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2026 Fonticons, Inc. --><path fill="currentColor" d="M433.2 103.1L581.4 253.4C609.1 281.5 609.1 326.5 581.4 354.6L425 512.9C415.7 522.3 400.5 522.4 391.1 513.1C381.7 503.8 381.6 488.6 390.9 479.2L547.3 320.8C556.5 311.5 556.5 296.4 547.3 287.1L399 136.9C389.7 127.5 389.8 112.3 399.2 103C408.6 93.7 423.8 93.8 433.1 103.2zM64.1 293.5L64.1 160C64.1 124.7 92.8 96 128.1 96L261.6 96C278.6 96 294.9 102.7 306.9 114.7L450.9 258.7C475.9 283.7 475.9 324.2 450.9 349.2L317.4 482.7C292.4 507.7 251.9 507.7 226.9 482.7L82.9 338.7C70.9 326.7 64.2 310.4 64.2 293.4zM208.1 208C208.1 190.3 193.8 176 176.1 176C158.4 176 144.1 190.3 144.1 208C144.1 225.7 158.4 240 176.1 240C193.8 240 208.1 225.7 208.1 208z"/></svg></i><span class="fr-sr-only">Go To Tag List</span></button>`);
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
