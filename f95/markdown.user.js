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
  function initFormat(tags, regex) {
    return {tagIndex: 0, tags, regex};
  }
  function initSubFormat(regex,subRegex){
    return {regex, subRegex};
  }

  const formats = {
    bold: initFormat(["strong"],/(?<!\\)\*\*/),
    italic: initFormat(["em"], /(?<!\\)_/),
    strikethrough: initFormat(["s"], /(?<!\\)~~/),
    inlineCode: initFormat(["ICODE"], /(?<!\\)`/),
    blockQuote: {
      tags: ["QUOTE"],
      regex: /^\s*(?:>|&gt;)\s*/,
      indexes: []
    },
    link: initSubFormat(/\[(.+?)]\((.+?)\)/g,'<a href="$2">$1</a>'),
  };
  // Posts button: div.formButtonGroup-primary > button:first-child
  // Threads button: div.formSubmitRow-controls > button:first-child
  function submitEvent() {
    const submitBtn = document.querySelector("div.formSubmitRow-controls > button:first-child")
      || document.querySelector("div.formButtonGroup-primary > button:first-child");
  }

  // Substitute matches on a single line
  function lineSubParse(lineTxt,format) {
    if (lineTxt.search(format.regex) === -1) return lineTxt;
    lineTxt = lineTxt.replace(format.regex,format.subRegex);
    return lineTxt;
  }

  function quoteParse() {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    const format = formats["blockQuote"];
    let count = 0;
    for (let i = 0; i < format.indexes.length; i++){
      // Removes `>`
      textBoxEl.children[format.indexes[i]].outerHTML = `<p>${textBoxEl.children[format.indexes[i]].innerHTML.replace(format.regex,"")}</p>`;
      if (format.indexes[i] + 1 !== format.indexes[i+1]){
        if (count === 0) {
          let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
          lineTxt = `[${format.tags[0]}]${lineTxt}[/${format.tags[0]}]`;
          const pTag = document.createElement("p");
          pTag.append(document.createTextNode(lineTxt));
          textBoxEl.children[format.indexes[i]].replaceWith(pTag);
        } else {
          let lineTxt = textBoxEl.children[format.indexes[i - count]].innerHTML;
          lineTxt = `[${format.tags[0]}]${lineTxt}`;
          textBoxEl.children[format.indexes[i - count]].outerHTML = `<p>${lineTxt}</p>`;
          lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
          lineTxt = `${lineTxt}[/${format.tags[0]}]`;
          textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}</p>`;
        }
        count = 0;
      } else {
        count++;
      }
    }
    formats["blockQuote"].indexes.length = 0;
  }
  function quoteInfoGather(lineTxt,format,i) {
    if (lineTxt.search(format.regex) !== -1) {
      format.indexes.push(i);
    }
  }

  function multiLineParse(lineTxt, format,startBracket,endBracket) {
    while (lineTxt.search(format.regex) !== -1) {
      if (!format.tagIndex) {
        lineTxt = lineTxt.replace(format.regex, `${startBracket}${format.tags[0]}${endBracket}`);
        format.tagIndex = 1;
      } else {
        lineTxt = lineTxt.replace(format.regex, `${startBracket}/${format.tags[0]}${endBracket}`);
        format.tagIndex = 0;
      }
    }
    // Make sure there's an equal number of open to closed tag ratio.
    let openTagsAmount = lineTxt.replaceAll(`${startBracket}${format.tags[0]}${endBracket}`, '@A@').match(/@A@/g)?.length ?? 0;
    let closedTagsAmount = lineTxt.replaceAll(`${startBracket}/${format.tags[0]}${endBracket}`, '@B@').match(/@B@/g)?.length ?? 0;
    if (openTagsAmount > closedTagsAmount) {
      lineTxt = `${lineTxt}${startBracket}/${format.tags[0]}${endBracket}`;
    } else if (closedTagsAmount > openTagsAmount) {
      lineTxt = `${startBracket}${format.tags[0]}${endBracket}${lineTxt}`;
    }
    return lineTxt;
  }
  function iHTMLParse(lineTxt,format) {
    return multiLineParse(lineTxt,format,'<','>');
  }
  function iBBCParse(lineTxt,format){
    return multiLineParse(lineTxt,format,'[',']');
  }

  function parse(lineTxt,i) {
    lineTxt = iHTMLParse(lineTxt, formats["bold"]);
    lineTxt = iHTMLParse(lineTxt, formats["italic"]);
    lineTxt = iHTMLParse(lineTxt, formats["strikethrough"]);
    lineTxt = iBBCParse(lineTxt,formats["inlineCode"]);
    quoteInfoGather(lineTxt,formats["blockQuote"],i);
    lineTxt = lineSubParse(lineTxt,formats["link"]);
    return lineTxt;
  }

  function parseMarkdown() {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    console.clear();
    for (let i = 0; i < textBoxEl.children.length; i++) {
      const lineEl = textBoxEl.children[i];
      if (lineEl.innerHTML === "<br>") {
        continue;
      }
      lineEl.outerHTML = "<p>" + parse(lineEl.innerHTML,i) + "</p>";
      // DEBUG: Writes results to dev console
      // console.log("<p>" + parseLine(lineEl.innerHTML) + "</p>");
    }
    quoteParse();
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