// ==UserScript==
// @name        F95 Markdown
// @namespace   1330126-edexal
// @match       *://f95zone.to/threads/*
// @match       *://f95zone.to/forums/*/post-thread
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     0.1.0
// @author      Edexal
// @description Create posts and threads using markdown syntax.
// @homepageURL -
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// ==/UserScript==
(async () => {
  const textBoxEl = document.querySelector('div.fr-element');
  const formats = {
    bold: {
      tagIndex: 0,
      tags: ["strong"],
      regex: /\*\*/,
    }
  };
  //'<p><em>Hello </em></p><p><br></p><p><u>The</u> <s>names</s> the&nbsp;</p><p><br></p><p><strong><span style="font-size: 18px;">games</span></strong></p><p><br></p><p><a href="https://google.com" target="_blank" rel="noopener noreferrer">gesgesg</a></p>'
  // Posts button: div.formButtonGroup-primary > button:first-child
  // Threads button: div.formSubmitRow-controls > button:first-child
  function submitEvent() {
    const submitBtn = document.querySelector("div.formSubmitRow-controls > button:first-child")
      || document.querySelector("div.formButtonGroup-primary > button:first-child");
  }

  function inlineParse(lineTxt, format) {
    while (lineTxt.search(format.regex) !== -1) {
      if (!format.tagIndex) {
        lineTxt = lineTxt.replace(format.regex, `<${format.tags[0]}>`);
        format.tagIndex = 1;
      } else {
        lineTxt = lineTxt.replace(format.regex, `</${format.tags[0]}>`);
        format.tagIndex = 0;
      }
    }
    // Make sure there's an equal number of open to closed tag ratio.
    let openTagsAmount = lineTxt.replaceAll(`<${format.tags[0]}>`, '@A@').match(/@A@/g)?.length ?? 0;
    let closedTagsAmount = lineTxt.replaceAll(`</${format.tags[0]}>`, '@B@').match(/@B@/g)?.length ?? 0;
    if (openTagsAmount > closedTagsAmount) {
      lineTxt = `${lineTxt}</${format.tags[0]}>`;
    } else if (closedTagsAmount > openTagsAmount){
      lineTxt = `<${format.tags[0]}>${lineTxt}`;
    }
    return lineTxt;
  }

  function parse(lineTxt) {
    lineTxt = inlineParse(lineTxt, formats["bold"]);
    return lineTxt;
  }

  function parseMarkdown() {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    console.clear();
    for (const lineEl of textBoxEl.children) {
      if (lineEl.innerHTML === "<br>") {
        continue;
      }
      lineEl.outerHTML = "<p>" + parse(lineEl.innerHTML) + "</p>";
      // DEBUG: Writes results to dev console
      // console.log("<p>" + parseLine(lineEl.innerHTML) + "</p>");
    }
  }

  function createButton() {
    const btnLayer = document.querySelector("div.formButtonGroup-primary,div.formSubmitRow-controls");
    if (!btnLayer) return;
    const btn = document.createElement('button');
    btn.append(document.createTextNode("TEST"));
    btn.type = "button";
    btn.addEventListener("click", parseMarkdown);
    btnLayer.prepend(btn);
  }

  createButton();

  /*TODO: For Submit button
     1. Hide original submit and replace with custom button
     2. If clicked, transform markdown back into HTML format
     3. Swap buttons back
     4. Click submit on original button
  * */
  /*TODO: For Preview button
      1. Hide original preview and replace with custom button
      2. If clicked, transform markdown back into HTML format
      3. Swap buttons back
      4. Click preview of original button
      5. Repeat step 1 */
  // Textbox: div.bbWrapper div[spellcheck][class*=fr-element]
  /*TODO: Parsing
     - Get text using textBoxEl.innerHTML
  *  - Loop through each markdown syntax type
     - Apply markdown attributes. Make sure add closing tag for each line if it expands that far.
  */
})()