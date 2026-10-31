// ==UserScript==
// @name        F95 Infinite Scroll Review
// @namespace   1330126-edexal
// @match       *://f95zone.to/*/reviews/
// @grant       GM.xmlhttpRequest
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.0.1
// @author      Edexal
// @description Infinitely scroll through reviews on the reviews page.
// @homepageURL https://sleazyfork.org/en/scripts/603070-f95-infinite-scroll-review
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@2f4f36215375a30485901a0374cb58a78412ddf3/_lib/gm-utility.js
// ==/UserScript==
(() => {
  Edexal.addCSS(`
  .ed-warning {
    font-size: 1.4em;
    font-weight: bold;
    font-style: italic;
    color: #c7a5a5;
    text-align: center;
    border-width: 2px 0;
    border-style: ridge none;
  }
  .ed-hr {
    border: 2px dashed #d4a929;
    width: 100%;
  }`);
  const EL = {target:'footer#footer', reviewSect: '.f95rv-cards', reviews: 'article.f95rv-card', pageNavs: '.f95rv-pageNav'};
  const GLOBAL = {totalPages: 1, currentPage: 1};
  const LABEL = {load: 'Loading More...', complete: '- No More Reviews -'};
  
  function getReviewPageAsync(pageNum) {
    const url = new URL(location.href);
    url.searchParams.set('page', pageNum);
    return EdexalGM.getAsync(url.href);
  }
  
  function addReviewsFromPage(pageDoc) {
    const newReviews = pageDoc.querySelectorAll(EL.reviews);
    const reviewSect = Edexal.$(EL.reviewSect);
    const hr = Edexal.newEl({element:'hr', class: ['ed-hr']});
    reviewSect.append(hr,...newReviews);
  }
  
  function addReviewLabel(text) {
    const div = Edexal.newEl({element:'div', class:['ed-warning']});
    const p = Edexal.newEl({element: 'p', text});
    div.append(p);
    Edexal.$(EL.reviewSect).after(div);
  }
  
  function changeReviewLabel(text) {
    Edexal.$('.ed-warning p').textContent = text;
  }
  
  async function processMoreReviews(obs) {
    if (GLOBAL.totalPages === GLOBAL.currentPage) {
      changeReviewLabel(LABEL.complete);
      return obs.disconnect();
    }
    try {
      const res = await getReviewPageAsync(++GLOBAL.currentPage);
      const pageDoc = res.response;
      addReviewsFromPage(pageDoc);
    } catch(e) {
      console.error(e);
    }
  }
  
  async function observeReviews(entries, obs) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      await processMoreReviews(obs);
      return;
    }
  }
  
  function initObserver() {
    const observer = new IntersectionObserver(
      async (entries, obs) => await observeReviews(entries, obs), {
        delay: 1000, 
        rootMargin: '0px 0px 200px 0px', 
        threshold: 1
      });
    observer.observe(Edexal.$(EL.target));
  }
  
  function getTotalPages() {
    const lastNavPage = Edexal.$('.pageNav-main li:last-child a');
    if (!lastNavPage) return 1;
    return +lastNavPage.textContent;
  }
  
  function removeAllPageNavs() {
    Edexal.$$(EL.pageNavs).forEach((el) => el.remove());
  }
  
  function run() {
    GLOBAL.totalPages = getTotalPages();
    if (GLOBAL.totalPages === 1) return addReviewLabel(LABEL.complete);
    addReviewLabel(LABEL.load);
    const reviews = Edexal.$$(EL.reviews);
    if (!reviews.length) return;
    removeAllPageNavs();
    initObserver();
  }
  run();
})();