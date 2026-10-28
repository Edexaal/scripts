// ==UserScript==
// @name        F95 Resume Bookmark
// @namespace   1330126-edexal
// @match       *://f95zone.to/*
// @grant       GM.setValue
// @grant       GM.getValues
// @grant       GM.deleteValue
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     2.0.0
// @author      Edexal
// @description Bookmark page resumes from the last saved configuration set.
// @homepageURL https://sleazyfork.org/en/scripts/571484-resume-bookmark
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@3fcde43d7e7e48680ea5fb2715febcfd82058257/_lib/utility.js
// ==/UserScript==
(async () => {
  Edexal.addCSS(`
  .ed-bm-btn {
    color: yellow;
    background: linear-gradient(to top left, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.2) 30%, rgb(0 0 0 / 0)) #ba4545;
    border: 1px solid #a4a4a4;
    border-radius: 5px;
    width: 28px;
    height: 28px;
    transition: opacity .2s cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
        opacity: 0.8;
        cursor: pointer;
        border-color: #3a46ff;
    }
  }
  .ed-icon-center {
    position: relative;
    top: 2px;
  }
  `);
  const KEY_ID = {was_bookmark:'was_bookmark', bm_url:'bm_url'};
  let STORAGE;
  
  async function save(key, item) {
    await GM.setValue(key, item);
    STORAGE[key] = item;
  }
  
  function addBtn({title, svgHTML, callback: asyncCallback,iClasses}) {
    const btn = Edexal.newEl({element: 'button', class: ['ed-bm-btn'], title});
    Edexal.on(btn, 'click', async () => await asyncCallback());
    const i = Edexal.newEl({element: 'i', class: iClasses});
    i.innerHTML = svgHTML;
    btn.append(i);
    Edexal.$('.f95wg-bar .f95wg-labelMenu').insertAdjacentElement('afterend', btn);
  }
  
  function initBtns() {
    const btnStats = [{
      title: 'Save',
      svgHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"/></svg>`,
      callback: async () => await save(KEY_ID.bm_url, location.search),
    }, {
      title: 'Go To URL',
      svgHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"/></svg>`,
      callback: async () => {
        if (STORAGE.bm_url) {
          location.search = STORAGE.bm_url;
        }
      },
      iClasses: ['ed-icon-center']
    }, {
      title: 'Delete',
      svgHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"/></svg>`,  
      callback: async () => {
        await save(KEY_ID.bm_url, null);
        location.search = '?tab=bookmarks';
      }
    }];
    for (const stat of btnStats) {
      addBtn(stat);
    }
  }
  
  async function initBookmarkPage() {
    initBtns();
    if (!STORAGE.was_bookmark) {
      await save(KEY_ID.was_bookmark, true);
      if (STORAGE.bm_url) {
        location.search = STORAGE.bm_url;
      }
    }
  }
  
  async function initOtherPages() {
    if (STORAGE.was_bookmark) {
      await save(KEY_ID.was_bookmark, false);
    }
  }

  async function run() {
    // DEPRECATED: Removes deprecated 'label' key from storage
    await GM.deleteValue('label');
    STORAGE = await GM.getValues(Object.values(KEY_ID));
    if (Edexal.isBookmarkPage()) {
      initBookmarkPage();
    } else {
      initOtherPages();
    }
  }

  await run();
})()