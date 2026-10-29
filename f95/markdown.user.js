// ==UserScript==
// @name        F95 Markdown
// @namespace   1330126-edexal
// @match       *://f95zone.to/threads/*
// @match       *://f95zone.to/forums/*/post-thread
// @match       *://f95zone.to/conversations/*
// @match       *://f95zone.to/markdown
// @match       *://f95zone.to/account/signature
// @grant       none
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @license     Unlicense
// @version     1.4.0
// @author      Edexal
// @description Use Markdown syntax in threads, posts, and conversations.
// @homepageURL https://sleazyfork.org/en/scripts/566411-f95-markdown
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@23f86bce8d8c88bc66704d0971ba7eb11be92caa/_lib/utility.js
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@23f86bce8d8c88bc66704d0971ba7eb11be92caa/_lib/markdown-page-template.js
// ==/UserScript==
(async () => {
  const MARKDOWN_PATH = "/markdown";
  const EL = {
    textbox: 'div.bbWrapper div[spellcheck][class*=fr-element]',
    toolbar: 'div.fr-toolbar',
    buttonGroup: 'div.formButtonGroup-primary,div.formSubmitRow-controls'
  };
  let formats = {};
  const CSS_MARKDOWN_PAGE = `
    #md-toc {
      position: fixed;
      right:5vw;
      overflow-y:auto;
      overflow-x: hidden;
      height: 300px;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: #f315ef rebeccapurple;
      background-color: #242629;
      ul {
        list-style: none;
        padding: 0;
        margin-right: 15px;
        width: 150px;
        font-size: 1.44rem;
        a {
          text-decoration: none;
          color: #ffcb00;
          li {
            text-align: center;
            padding: 3px 5px;
            border-bottom: 1px dashed black;
          }
        }
      }
    }
    h1.p-title-value {
      text-align: center;
      font-weight: 600 !important;
      font-size: 3rem !important;
      width: 100%;
    }
  `;
  const CSS_TOOLBAR = `
    #md-syntax-1 i {
      color: yellow;
    }
    .ed-review-btnlayer button {
      text-align: center;
      background: linear-gradient(to top left, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.2) 30%, rgb(0 0 0 / 0)) #ba4545 !important;
      border: 1px solid #a4a4a4;
      border-radius: 5px;
      width: 100%;
      padding: 0;
      transition: opacity .2s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover {
        opacity: 0.8;
        cursor: pointer;
        border-color: #9adc49;
      }
    }
  `;

  function initHeader(tags, regex) {
    return {tags, regex};
  }

  function initFormat(tags, regex) {
    return {tagIndex: 0, ...initHeader(tags, regex)};
  }

  function initListFormat(tags, uRegex, oRegex) {
    return {tagIndex: 0, indentLevel: 0, prevType: null, oRegex, uRegex, tags};
  }

  function initSubFormat(regex, subRegex) {
    return {regex, subRegex};
  }

  function initQuoteFormat(tags, regex, typeRegex, altRegex, altReplace) {
    return {tags, regex, typeRegex, altRegex, altReplace, indexes: []};
  }

  function initSpoilerFormat(tags, regex, startRegex, typeRegex, endBlockStr) {
    return {tags, regex, startRegex, typeRegex, endBlockStr, indexes: []};
  }

  function initColorFormat(tags, startRegex, endRegex, colorRegex) {
    return {tags, startRegex, endRegex, colorRegex};
  }

  function defaultFormats() {
    return {
      bold: initFormat(["strong"], /(?<!\\)\*\*/),
      italic: initFormat(["em"], /(?<!\\)(?<!_)_(?!_)/),
      underline: initFormat(["U"], /(?<!\\)(?<!_)_{2}(?!_)/),
      strikethrough: initFormat(["s"], /(?<!\\)~~/),
      inlineCode: initFormat(["ICODE"], /(?<![\\`])`(?!``)/),
      link: initSubFormat(/\[(.+?)]\((.+?)\)/g, '<a href="$2">$1</a>'),
      blockQuote: initQuoteFormat(["QUOTE"], /^(?:\s|&nbsp;)*(?:>|&gt;)(?:\s|&nbsp;)*/, /^(?:\s|&nbsp;)*(?:>|&gt;){2,}(?:\s|&nbsp;)*(.+)/, /^(?:\s|&nbsp;)*(?:>|&gt;)(?:\s|&nbsp;)*(?!.+)/, "&nbsp;"),
      code: initSpoilerFormat(["CODE"], /^(?:\s|&nbsp;)*```/, /^(?:\s|&nbsp;)*```/, /^(?:\s|&nbsp;)*```(.+)/, "```"),
      header1: initHeader(["SIZE=7", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)#(?!#)(?:\s|&nbsp;)*/),
      header2: initHeader(["SIZE=6", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)##(?!#)(?:\s|&nbsp;)*/),
      header3: initHeader(["SIZE=5", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)###(?:\s|&nbsp;)*/),
      list: initListFormat(["LIST", "LIST=1", "*"], /^(?:\s|&nbsp;)*-(?:\s|&nbsp;)*/, /^(?:\s|&nbsp;)*\d+\.(?:\s|&nbsp;)*/),
      spoiler: initSpoilerFormat(["SPOILER"], /^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*(?:spoiler)?/, /(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*spoiler/, /^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*spoiler=(.+)/, ":::"),
      inlineSpoiler: initFormat(["ISPOILER"], /(?<!\\)\|\|/),
      alignment: initSpoilerFormat(["RIGHT", "CENTER"], /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(?:right|center)?/, /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(?:right|center)/, /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(right|center)/, "&lt;&lt;&lt;"),
      color: initColorFormat(["COLOR"], /(?<!\\)%#[a-fA-F0-9]{6}%/, /(?<!\\)%{2}/, /%(#[a-fA-F0-9]{6})%/),
    };
  }

  // Substitute matches on a single line
  function lineSubParse(lineTxt, format) {
    if (lineTxt.search(format.regex) === -1) return lineTxt;
    lineTxt = lineTxt.replace(format.regex, format.subRegex);
    return lineTxt;
  }

  function getType(format, textBoxEl, i) {
    let type = undefined;
    if (format.typeRegex && textBoxEl.children[format.indexes[i]].innerHTML.search(format.typeRegex) !== -1) {
      type = textBoxEl.children[format.indexes[i]].innerHTML.replace(format.typeRegex, "$1");
    }
    return type;
  }

  function getIndentNum(lineTxt, curIndexLVL) {
    let total = 0;
    while (lineTxt.search(/^(?<!-)(?:&nbsp;|\s){2}/g) !== -1 && total < curIndexLVL + 1) {
      lineTxt = lineTxt.replace(/^(?<!-)(?:&nbsp;|\s){2}/, "");
      total += 1;
    }
    return total;
  }

  function blockParse(format, isOpenTagCB) {
    const textBoxEl = Edexal.$(EL.textbox);
    for (let i = 0; i < format.indexes.length; i++) {
      let type = getType(format, textBoxEl, i);
      const isOpenTag = isOpenTagCB ? isOpenTagCB(i) : !!textBoxEl.children[format.indexes[i]].innerHTML.match(format.startRegex); 
      if (type || isOpenTag) {
        let tag = `[${format.tags[0]}${type ? `=${type}` : ""}]`;
        const newTxt = textBoxEl.children[format.indexes[i]].innerHTML.replace(type ? format.typeRegex : format.startRegex, tag); 
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${newTxt}</p>`;
      } else {
        let tag = `[/${format.tags[0]}]`;
        let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
        lineTxt = lineTxt.replace(format.endBlockStr, "");
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}${tag}</p>`;
      }
    }
    format.indexes.length = 0;
  }

  function alignParse(format) {
    const textBoxEl = Edexal.$(EL.textbox);
    for (let i = 0; i < format.indexes.length; i++) {
      format.type = getType(format, textBoxEl, i) ?? format.type;
      const alignTag = format.type === "right" ? format.tags[0] : format.tags[1];
      if (!!textBoxEl.children[format.indexes[i]].innerHTML.match(format.startRegex)) {
        let tag = `[${alignTag}]`;
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${tag}</p>`;
      } else {
        let tag = `[/${alignTag}]`;
        let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
        lineTxt = lineTxt.replace(format.endBlockStr, "");
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}${tag}</p>`;
      }
    }
    format.indexes.length = 0;
  }

  function quoteParse() {
    const textBoxEl = Edexal.$(EL.textbox);
    const format = formats["blockQuote"];
    let count = 0;
    let type = undefined;
    for (let i = 0; i < format.indexes.length; i++) {
      if (format.typeRegex && textBoxEl.children[format.indexes[i]].innerHTML.search(format.typeRegex) !== -1) {
        type = textBoxEl.children[format.indexes[i]].innerHTML.replace(format.typeRegex, "$1");
      }
      // Removes `>`
      if (format.altRegex && textBoxEl.children[format.indexes[i]].innerHTML.search(format.altRegex) !== -1) {
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${textBoxEl.children[format.indexes[i]].innerHTML.replace(format.altRegex, format.altReplace)}</p>`;
      } else {
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${textBoxEl.children[format.indexes[i]].innerHTML.replace(format.regex, "")}</p>`;
      }
      if (format.indexes[i] + 1 !== format.indexes[i + 1]) {
        if (count === 0) {
          let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
          lineTxt = `[${format.tags[0]}]${lineTxt}[/${format.tags[0]}]`;
          const pTag = document.createElement("p");
          pTag.append(document.createTextNode(lineTxt));
          textBoxEl.children[format.indexes[i]].replaceWith(pTag);
        } else {
          let lineTxt;
          if (type) {
            textBoxEl.children[format.indexes[i - count]].outerHTML = "<p></p>";
            lineTxt = textBoxEl.children[format.indexes[i - count + 1]].innerHTML;
            lineTxt = `[${format.tags[0]}=${type}]${lineTxt}`;
            textBoxEl.children[format.indexes[i - count + 1]].outerHTML = `<p>${lineTxt}</p>`;
          } else {
            lineTxt = textBoxEl.children[format.indexes[i - count]].innerHTML;
            lineTxt = `[${format.tags[0]}]${lineTxt}`;
            textBoxEl.children[format.indexes[i - count]].outerHTML = `<p>${lineTxt}</p>`;
          }
          lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
          lineTxt = `${lineTxt}[/${format.tags[0]}]`;
          textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}</p>`;
        }
        type = undefined;
        count = 0;
      } else {
        count++;
      }
    }
    formats["blockQuote"].indexes.length = 0;
  }

  function infoGather(lineTxt, format, i) {
    if (lineTxt.search(format.regex) !== -1) {
      format.indexes.push(i);
    }
  }

  function fullLineParse(lineTxt, format) {
    if (lineTxt.search(format.regex) === -1) return lineTxt;
    lineTxt = lineTxt.replace(format.regex, `[${format.tags[0]}]`);
    return `${lineTxt}[/${format.tags[1]}]`;
  }

  function listParse(lineTxt, format) {
    if (lineTxt.search(format.uRegex) === -1 && lineTxt.search(format.oRegex) === -1) {
      if (format.tagIndex) {
        let endings = `[/${format.tags[0]}]`;
        while (format.indentLevel > 0) {
          endings = `[/${format.tags[0]}]${endings}`;
          format.indentLevel -= 1;
        }
        format.tagIndex = 0;
        return `${endings}${lineTxt}`;
      }
      return lineTxt;
    }
    const lineIndent = getIndentNum(lineTxt, format.indentLevel);
    const list = lineTxt.search(format.uRegex) !== -1 ? {
      tag: format.tags[0],
      regex: format.uRegex
    } : {tag: format.tags[1], regex: format.oRegex};
    if (!format.tagIndex) {
      lineTxt = lineTxt.replace(list.regex, `[${list.tag}][${format.tags[2]}]`);
      format.tagIndex = 1;
    } else {
      if (lineIndent > format.indentLevel) {
        lineTxt = lineTxt.replace(list.regex, `[${list.tag}][${format.tags[2]}]`);
      } else if (lineIndent < format.indentLevel) {
        lineTxt = lineTxt.replace(list.regex, "");
        let endings = `[/${format.tags[0]}]`;
        while (lineIndent < format.indentLevel) {
          endings = `[/${format.tags[0]}]${endings}`;
          format.indentLevel -= 1;
        }
        if (lineIndent === 0) {
          lineTxt = `${endings}[${list.tag}][${format.tags[2]}]${lineTxt}`;
        } else {
          lineTxt = `${endings}[${format.tags[2]}]${lineTxt}`;
        }
      } else {
        if (list.tag === format.prevType || !format.prevType) {
          lineTxt = lineTxt.replace(list.regex, `[${format.tags[2]}]`);
        } else {
          lineTxt = lineTxt.replace(list.regex, `[/${format.tags[0]}][${list.tag}][${format.tags[2]}]`);
        }
      }
      format.indentLevel = lineIndent;
    }
    format.prevType = list.tag;
    return lineTxt;
  }

  function endListParse(lineTxt, format) {
    if (!format.tagIndex) return lineTxt;
    let endings = `[/${format.tags[0]}]`;
    while (format.indentLevel > 0) {
      endings = `[/${format.tags[0]}]${endings}`;
      format.indentLevel -= 1;
    }
    format.tagIndex = 0;
    return `${lineTxt}${endings}`;
  }

  function colorParse(lineTxt, format) {
    while (!!lineTxt.match(format.startRegex) || !!lineTxt.match(format.endRegex))
      if (!!lineTxt.match(format.startRegex)) {
        lineTxt = lineTxt.replace(format.colorRegex, `[COLOR=$1]`);
      } else if (!!lineTxt.match(format.endRegex)) {
        lineTxt = lineTxt.replace(format.endRegex, "[/COLOR]");
      }
    return lineTxt;
  }

  function multiFullLineParse(lineTxt, format, startBracket, endBracket) {
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

  function iHTMLParse(lineTxt, format) {
    return multiFullLineParse(lineTxt, format, '<', '>');
  }

  function iBBCParse(lineTxt, format) {
    return multiFullLineParse(lineTxt, format, '[', ']');
  }
  
  // Protect Markdown links before processing inline formatting.
  function protectLinks(lineTxt) {
    const links = [];

    lineTxt = lineTxt.replace(
      formats.link.regex,
      (match, text, url) => {
        const token = `MDLINKPLACEHOLDER${links.length}END`;

        links.push({
          token,
          html: `<a href="${url}">${text}</a>`
        });

        return token;
      }
    );
    return { lineTxt, links };
  }

  // Restore links after all Markdown formatting.
  function restoreLinks(lineTxt, links) {
    for (const { token, html } of links) {
      lineTxt = lineTxt.replace(token, () => html);
    }
    return lineTxt;
  }

  function parse(lineTxt, i) {
    const protectedLinks = protectLinks(lineTxt);
    lineTxt = protectedLinks.lineTxt;
    
    lineTxt = iHTMLParse(lineTxt, formats["bold"]);
    lineTxt = iHTMLParse(lineTxt, formats["italic"]);
    lineTxt = iHTMLParse(lineTxt, formats["strikethrough"]);
    lineTxt = iBBCParse(lineTxt, formats["underline"]);
    lineTxt = iBBCParse(lineTxt, formats["inlineSpoiler"]);
    lineTxt = iBBCParse(lineTxt, formats["inlineCode"]);
    lineTxt = colorParse(lineTxt, formats["color"]);
    infoGather(lineTxt, formats["blockQuote"], i);
    infoGather(lineTxt, formats["code"], i);
    infoGather(lineTxt, formats["spoiler"], i);
    infoGather(lineTxt, formats["alignment"], i);
    lineTxt = fullLineParse(lineTxt, formats["header1"]);
    lineTxt = fullLineParse(lineTxt, formats["header2"]);
    lineTxt = fullLineParse(lineTxt, formats["header3"]);
    lineTxt = listParse(lineTxt, formats["list"]);
    return restoreLinks(lineTxt, protectedLinks.links);
  }

  function getOpenCloseTags(lineEl) {
    let openTag = '<p>';
    let closeTag = '</p>';
    if (lineEl.outerHTML.includes("text-align: center")) {
      openTag = '<p style="text-align: center;">';
      closeTag = '</p>';
    } else if (lineEl.outerHTML.includes("text-align: right")) {
      openTag = '<p style="text-align: right;">';
      closeTag = '</p>';
    } else if (lineEl.nodeName === "UL") {
      openTag = '<ul>';
      closeTag = '</ul>';
    } else if (lineEl.nodeName === "OL") {
      openTag = '<ol>';
      closeTag = '</ol>';
    } else if (lineEl.nodeName === "LI") {
      const listType = lineEl.getAttribute("data-xf-list-type");
      openTag = `<li data-xf-list-type=${listType}`;
      closeTag = '</li>';
    } else if (lineEl.nodeName === "BLOCKQUOTE") {
      const dataset = lineEl.dataset;
      openTag = `<blockquote data-quote="${dataset.quote}" data-source="${dataset.source}" data-attributes="${dataset.attributes}">`;
      closeTag = '</blockquote>';
;   }
    return [openTag, closeTag];
  }

  function canSkip(lineEl) {
    const innerHTML = lineEl.innerHTML;
    return innerHTML === "<br>" || innerHTML.startsWith("<img");
  }

  function parseMarkdown(textBoxEl) {
    formats = defaultFormats();
    let lastIndex = 0;
    for (let i = 0; i < textBoxEl.children.length; i++) {
      const lineEl = textBoxEl.children[i];
      if (canSkip(lineEl)) {
        continue;
      }
      const [openingTag, closingTag] = getOpenCloseTags(lineEl);
      lineEl.outerHTML = openingTag + parse(lineEl.innerHTML, i) + closingTag;
      lastIndex = i;
    }
    quoteParse();
    blockParse(formats["code"], (i) => i % 2 === 0);
    blockParse(formats["spoiler"]);
    alignParse(formats["alignment"]);
    textBoxEl.children[lastIndex].outerHTML = "<p>" + endListParse(textBoxEl.children[lastIndex].innerHTML, formats["list"]) + "</p>";
  }
  
  function tagsWithPastedText(textBoxEl) {
    const pastedTextIndices = [];
    const textboxChildrenCopy = Array.from(textBoxEl.children);
    for (const [i,el] of textboxChildrenCopy.entries()) {
      if (el.tagName !== 'P'){
        continue;
      }
      const brMatches = el.innerHTML.match(/<br>/g);
      if (brMatches && brMatches.length > 1) {
        pastedTextIndices.push(i);
      }
    }
    return pastedTextIndices;
  }
  
  function splitPastedText(textBoxEl, childElIndices) {
    const pastedTextInfo = {};
    for (const i of childElIndices) {
      pastedTextInfo[i] = textBoxEl.children[i].innerHTML.split('<br>');
    }
    return pastedTextInfo;
  }
  
  function addTextToTextBox(textBoxEl, pastedTextInfo) {
    for (const [elIndex, contentArr] of Object.entries(pastedTextInfo)) {
      const fragment = new DocumentFragment();
      for (const txt of contentArr) {
        let p;
        if (txt === ''){
          p = Edexal.newEl({element:'p'}); 
          const br = Edexal.newEl({element:'br'}); 
          p.append(br);
          fragment.append(p);
        }
        
        let newTxt = Edexal.decodeHTMLEntities(txt); 
        p = Edexal.newEl({element: 'p', text: newTxt});
        fragment.append(p);
      }
      textBoxEl.children[elIndex].replaceWith(fragment);
    }
  }
  
  // Resolves Issue: When pasting to textbox, all text are wrapped in a single <p>
  function fixPastedTextIssue(textBoxEl) {
    const childElIndices = tagsWithPastedText(textBoxEl);
    if (!childElIndices.length) {
      return;
    }
    const pastedTextInfo = splitPastedText(textBoxEl, childElIndices);
    addTextToTextBox(textBoxEl, pastedTextInfo);
  }

  function createButton(btnLayer, textboxEl) {
    const btn = Edexal.newEl({element: 'button', type: 'button', class: ['button']});
    const spanText = Edexal.newEl({element: 'span', class: ['button-text'], text: "PARSE MD", style: "color: yellow;"});
    btn.append(spanText);
    Edexal.on(btn, 'click', () => {
      fixPastedTextIssue(textboxEl);
      parseMarkdown(textboxEl);
    });
    btnLayer.prepend(btn);
  }

  function applyButton(records, observer, shouldDisconnect) {
    for (const record of records) {
      if (!record.target.classList.contains('is-editing')) continue;
      const buttonLayer = record.target.querySelector(EL.buttonGroup);
      const textBoxEl = record.target.querySelector(EL.textbox);
      const toolbarEl = record.target.querySelector(EL.toolbar);
      createButton(buttonLayer, textBoxEl);
      applyhelpBtn(toolbarEl);
      if (shouldDisconnect) {
        observer.disconnect();
      }
    }
  }

  function buttonObserver(elToObserve, shouldDisconnect) {
    const el = Edexal.$(elToObserve);
    if (!el){
      return;
    }
    const obs = new MutationObserver((records, observer) => applyButton(records, observer, shouldDisconnect));
    obs.observe(el, {subtree: true, attributeFilter: ['class']});
  }

  function helpBtnClickEvent() {
    const a = Edexal.newEl({element: "a", href: MARKDOWN_PATH, target: "_blank"});
    a.click()
  }

  function createhelpToolbarBtn() {
    const button = Edexal.newEl({
      element: "button",
      id: "md-syntax-1",
      class: ["fr-command", "fr-btn", "fr-btn-font_awesome"],
      type: "button",
      tabindex: "-1",
      role: "button",
      title: "Markdown syntax help",
      "data-cmd": "md-syntax"
    });
    const i = Edexal.newEl({element: "i", class: ["fab", "fa-markdown"], "aria-hidden": "true"});
    i.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"/></svg>`;
    const span = Edexal.newEl({element: "span", class: ["fr-sr-only"], text: "Markdown syntax"})
    button.append(i, span)
    Edexal.on(button,"click",helpBtnClickEvent);
    return button;
  }

  function applyhelpBtn(toolbarEl) {
    const helpBtn = createhelpToolbarBtn();
    const toolBtnGroups = toolbarEl.querySelectorAll(".fr-float-left");
    toolBtnGroups[toolBtnGroups.length - 1].append(helpBtn);
  }

  function markdownPage() {
    const mainBodyEl = Edexal.$("div.p-body-content");
    // Removes all child elements
    mainBodyEl.querySelector("div.blockMessage").remove();
    //Removes Header
    Edexal.$("header").remove();
    // Removes navigation
    Edexal.$("div.p-navSticky").remove();
    // Removes footer
    Edexal.$("footer").remove();
    // Removes arrow scroll buttons
    Edexal.$(".uix_fabBar").remove();
    // Removes section links
    Edexal.$("#top .p-sectionLinks").remove();
    // Change site title
    Edexal.$("head title").textContent = "F95 Markdown Syntax";
    const titleEl = Edexal.$("h1.p-title-value");
    titleEl.textContent = "F95 Markdown Syntax";
    mainBodyEl.querySelector("div.p-body-pageContent").innerHTML = MARKDOWN_PAGE_HTML;
  }
  
  function observeTextbox(records, obs){
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('fr-toolbar')) {
          createButton(Edexal.$(EL.buttonGroup), Edexal.$(EL.textbox));
          applyhelpBtn(Edexal.$(EL.toolbar));
          obs.disconnect();
          return;
        }
      }
    }
  }
  
  function initReplyTextbox() {
    const replyTextBox = Edexal.$('.message-editorWrapper');
    if (!replyTextBox) return;
    const observer = new MutationObserver(observeTextbox);
    observer.observe(replyTextBox, {subtree: true, childList: true});
  }
  
  function createReviewBtnLayer() {
    let btnSect = Edexal.$('.ed-review-btnlayer');
    if (btnSect) return btnSect;
    btnSect = Edexal.newEl({element: 'div', class: ["ed-review-btnlayer"]});
    Edexal.$('.f95rv-dialog-count').after(btnSect);
    return btnSect;
  }
  
  function observeReviewToolbar(records, obs) {
    for(const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('fr-toolbar')) {
          const buttonLayer = createReviewBtnLayer();
          const textBoxEl = record.target.querySelector(EL.textbox);
          const toolbarEl = record.target.querySelector(EL.toolbar);
          createButton(buttonLayer, textBoxEl);
          applyhelpBtn(toolbarEl);
          obs.disconnect();
          return;
        }
      }
    }
  }
  
  function observeReviewDialog(records, obs) {
    for (const record of records) {
      if (record.target.classList.contains('is-modalOpen')) {
        const observer = new MutationObserver(observeReviewToolbar);
        observer.observe(Edexal.$('.f95rv-dialog-text'), {subtree: true, childList: true});
        obs.disconnect();
        return;
      }
    }
  }
  
  function initReviewPost() {
    if (!location.pathname.endsWith('reviews/')) return;
    const observer = new MutationObserver(observeReviewDialog); 
    observer.observe(Edexal.$('body'), {attributeFilter: ['class']});
  }
  
  // Program Start
  function start() {
    if (location.pathname !== MARKDOWN_PATH) {
      Edexal.addCSS(CSS_TOOLBAR);
      initReplyTextbox();
      // Edit Posts
      buttonObserver("div.block-container[data-lb-id]");
      // Review Page
      initReviewPost();
      } else {
        Edexal.addCSS(CSS_MARKDOWN_PAGE);
        markdownPage();
      }
  }
  
  start();
})()