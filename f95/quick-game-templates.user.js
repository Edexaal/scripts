// ==UserScript==
// @name        F95 Quick Game Templates
// @namespace   1330126-edexal
// @match       *://f95zone.to/forums/game-requests.3/post-thread*
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant       none
// @version     1.2.1
// @author      Edexal
// @license     Unlicense
// @description Adds more action buttons to the toolbar when making a game request on f95.
// @homepageURL https://sleazyfork.org/en/scripts/500283-f95-quick-game-templates
// @supportURL  https://github.com/Edexal/monkey-scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@57a7c3b57a1fe98b437559957f72f38b8304870d/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@57a7c3b57a1fe98b437559957f72f38b8304870d/_lib/game-request-templates.js
// ==/UserScript==
(() => {
  let styleCSS = `
    .edexal-btn{
        color:yellow !important;
    }
    `;
  const NEW_TEMPLATE = getNewTemplate();
  const REQ_TEMPLATE = getRequestTemplate();
  const UPDATE_TEMPLATE = getUpdateTemplate();

  function addButton() {
    let toolbarEl = document.querySelector('.fr-toolbar');
    toolbarEl.insertAdjacentHTML('beforeend', '<div class="fr-separator fr-vs" role="separator" aria-orientation="vertical"></div>' +
      '<button aria-controls="dropdown-menu-xfTemp-1" aria-expanded="false" aria-haspopup="false" class="fr-command fr-btn fr-dropdown fr-btn-font_awesome edexal-btn" data-cmd="xfTemp"\n' +
      '        id="xfTemp-1" role="button" tabindex="-1"\n' +
      '        type="button" title="Templates">\n' +
      '    <i aria-hidden="true" class="fas fa-file-word"></i>\n' +
      '    <span class="fr-sr-only">Templates</span>\n' +
      '</button>\n' +
      '<div aria-hidden="true" aria-labelledby="xfTemp-1" class="fr-dropdown-menu" id="dropdown-menu-xfTemp-1" role="listbox">\n' +
      '    <div class="fr-dropdown-wrapper" role="presentation">\n' +
      '        <div class="fr-dropdown-content" role="presentation">\n' +
      '            <ul class="fr-dropdown-list" role="presentation">\n' +
      '                <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempNew" role="option"\n' +
      '                                           tabindex="-1" title="New Game Template">New Game Template</a></li>\n' +
      '                <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempReq" role="option"\n' +
      '                                           tabindex="-1" title="Request Game Template">Request Game Template</a></li>\n' +
      '                <li role="presentation"><a class="fr-command" data-cmd="xfTemp" data-param1="xfTempUpdate" role="option"\n' +
      '                                           tabindex="-1" title="Update Game Template">Update Game Template</a></li>\n' +
      '            </ul>\n' +
      '        </div>\n' +
      '    </div>\n' +
      '</div>' +
      '<button id="xfTagList-1" title="Go To Tag List" type="button" tabindex="-1" role="button" class="fr-command fr-btn fr-btn-xf_font_awesome_5 edexal-btn" data-cmd="xfTagList"><i class="far fa-tags" aria-hidden="true"></i><span class="fr-sr-only">Go To Tag List</span></button>');
  }

  function refreshTextArea() {
    let textAreaEl = document.querySelector(".fr-element") //Text Area Element
    textAreaEl.replaceChildren();//Text Area Element
    let preEl = document.createElement("pre");
    textAreaEl.append(preEl); //Text Area Element
  }

  function displayTextClick(e, template) {
    refreshTextArea();
    let txt = document.createTextNode(template.body);
    document.querySelector(".fr-element").firstElementChild.append(txt); //Text Area Element
    document.querySelector('#xfTemp-1').classList.remove('fr-active', 'fr-selected');
    e.target.classList.remove('fr-selected');
    document.querySelector('[placeholder~=title]').value = template.title; //Thread title Element
  }

  function goToTagListClick(e) {
    window.open("https://f95zone.to/threads/tags-rules-and-list-updated-2024-01-29.10394");
  }

  function displayPrefixPlaceholder() {
    const prefixField = document.querySelector('.select2-search__field');
    prefixField.placeholder = "*DON'T FORGET TO SELECT THE PREFIX TAG HERE!!!";
  }

  function run() {
    edexal.applyCSS(styleCSS);
    addButton();
    displayPrefixPlaceholder();
    document.querySelector('[title=\"New Game Template\"]').addEventListener('click', (e) => displayTextClick(e, NEW_TEMPLATE));
    document.querySelector('[title=\"Request Game Template\"]').addEventListener('click', (e) => displayTextClick(e, REQ_TEMPLATE));
    document.querySelector('[title=\"Update Game Template\"]').addEventListener('click', (e) => displayTextClick(e, UPDATE_TEMPLATE));
    document.querySelector('#xfTagList-1').addEventListener('click', (e) => goToTagListClick(e));
  }

  function startOnTime() {
    const observer = new MutationObserver(() => {
      const toolbar = document.querySelector('.fr-toolbar');
      if (toolbar) {
        run();
        observer.disconnect();
      }
    });
    observer.observe(document.body, {subtree: true, childList: true});
  }

  startOnTime();
})();
