// ==UserScript==
// @name        F95 Reviews Only
// @namespace   1330126-edexal
// @match       *://f95zone.to/*/reviews/
// @grant       GM.setValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.0
// @author      Edexal
// @description Remove components on reviews page.
// @homepageURL -
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// ==/UserScript==
(async () => {
  Edexal.addCSS(`
  
  
  /* Custom upgrade*/
  #ed-upgrade {
    position: relative;
  }
  /* Custom icon */
  #ed-upgrade > span {
    color: yellow;
    cursor: pointer;
    font-size: 1.1em;
    transition: color .2s;
    &:hover {
      color: #f5a3a3;
    }
  }
  /* Custom menu */
  #ed-upgrade > div {
    position: absolute;
    z-index: 10;
    top: 30px;
    width: 200px;
    text-align: center;
    background: #242629;
    border: 1px solid #565555;
    & ul {
      list-style: none;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-radius: 10px;
      & li button {
        cursor: pointer;
        color: yellow;
        background: #242629;
        padding: 0.625rem 0;
        font-size: 1.5rem;
        border-radius: 8px;
        border: 1px solid black;
        &:hover {
          background-color: #822626;
        }
        &:active {
          transform: scale(0.9);
        }
      }
      & li, & button {
        width: 100%;
      }
    }
  }
  
  /* Utility */
  .ed-hide {
    display: none;
  }
  .ed-active {
    background-color: #822626 !important;
  }
  `);
  const EL = {menu: '#ed-upgrade > div', icon: '#ed-upgrade > span'};
  const TARGET = {statistics: 'section.f95rv-stats', highlights: '.f95rv-highlights', "older reviews": '.f95rv-older'};
  
  function initBtn() {
    const container = Edexal.newEl({element: 'div', id: 'ed-upgrade'});
    const span = Edexal.newEl({element: 'span'});
    Edexal.on(span,'click', () => Edexal.$(EL.menu).classList.toggle('ed-hide'));
    const i = Edexal.newEl({element: 'i', class: ['fa-solid','fa-gear']});
    span.append(i);
    container.append(span);
    Edexal.$('.f95rv-sortBar').prepend(container);
  }
  
  function createMenuItem(label, eventFunc) {
    const li = Edexal.newEl({element: 'li'});
    const button = Edexal.newEl({element: 'button', text: label, "data-name": label.toLowerCase()});
    Edexal.on(button,'click', eventFunc);
    li.append(button);
    return li;
  }
  
  function toggleVisibilityEvent(label) {
    return async () => {
      const menuItem = Edexal.$(`${EL.menu} button[data-name="${label}"]`);
      if (menuItem?.classList.contains('ed-active')) {
        menuItem.classList.remove('ed-active');
        await GM.deleteValue(menuItem.dataset.name);
      }
      else {
        Edexal.$(TARGET[label])?.remove();
        menuItem.classList.add('ed-active');
        await GM.setValue(menuItem.dataset.name, true);
      }
    }
  } 
  
  function initMenu(){
    const menu = Edexal.newEl({element: 'div', class: ['ed-hide']});
    const heading = Edexal.newEl({element: 'h2', text: 'Review Settings'});
    const ul = Edexal.newEl({element: 'ul'});
    const menuItems = [
      createMenuItem('Statistics', toggleVisibilityEvent('statistics')),
      createMenuItem('Highlights', toggleVisibilityEvent('highlights')),
      createMenuItem('Older Reviews', toggleVisibilityEvent('older reviews')),
    ];
    ul.append(...menuItems);
    menu.append(heading, ul);
    Edexal.$('#ed-upgrade').append(menu);
  }
  
  async function initSettings() {
    const keys = await GM.listValues();
    for (const labelName of keys) {
      Edexal.$(`${EL.menu} button[data-name="${labelName}"]`).classList.add('ed-active');
      Edexal.$(TARGET[labelName]).remove();
    }
  }
  
  async function run() {
    initBtn();
    initMenu();
    await initSettings();
  }
  await run();
})();