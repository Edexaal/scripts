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
// @description Create posts and threads using markdown.
// @homepageURL -
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// ==/UserScript==
(async () => {
  function initHeader(tags, regex) {
    return {tags, regex};
  }

  function initFormat(tags, regex) {
    return {tagIndex: 0, ...initHeader(tags, regex)};
  }

  function initListFormat(tags, uRegex, oRegex) {
    return {indentLevel: 0, oRegex, uRegex, tags};
  }

  function initSubFormat(regex, subRegex) {
    return {regex, subRegex};
  }

  function initQuoteFormat(tags, regex, typeRegex, altRegex, altReplace) {
    return {tags, regex, typeRegex, altRegex, altReplace, indexes: []};
  }

  function initCodeFormat(tags, regex, typeRegex) {
    return {tags, regex, typeRegex, indexes: [], tagIndex: 0};
  }

  function initColorFormat(tags, regex, colorRegex) {
    return {tags, regex, colorRegex};
  }

  const formats = {
    bold: initFormat(["strong"], /(?<!\\)\*\*/),
    italic: initFormat(["em"], /(?<!\\)(?<!_)_(?!_)/),
    underline: initFormat(["U"], /(?<!\\)(?<!_)_{2}(?!_)/),
    strikethrough: initFormat(["s"], /(?<!\\)~~/),
    inlineCode: initFormat(["ICODE"], /(?<![\\`])`(?!``)/),
    link: initSubFormat(/\[(.+?)]\((.+?)\)/g, '<a href="$2">$1</a>'),
    blockQuote: initQuoteFormat(["QUOTE"], /^(?:\s|&nbsp;)*(?:>|&gt;)(?:\s|&nbsp;)*/, /^(?:\s|&nbsp;)*(?:>|&gt;){2,}(?:\s|&nbsp;)*(.+)/, /^(?:\s|&nbsp;)*(?:>|&gt;)(?:\s|&nbsp;)*(?!.+)/, "&nbsp;"),
    code: initCodeFormat(["CODE"], /^(?:\s|&nbsp;)*```/, /^(?:\s|&nbsp;)*```(.+)/),
    header1: initHeader(["SIZE=7", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)#(?!#)(?:\s|&nbsp;)*/),
    header2: initHeader(["SIZE=6", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)##(?!#)(?:\s|&nbsp;)*/),
    header3: initHeader(["SIZE=5", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)###(?:\s|&nbsp;)*/),
    list: initListFormat(["LIST", "LIST=1", "*"], /^(?:\s|&nbsp;)*-(?:\s|&nbsp;)*/, /^(?:\s|&nbsp;)*\d+\.(?:\s|&nbsp;)*/),
    spoiler: initCodeFormat(["SPOILER"], /^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*(?:spoiler)?/, /^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*spoiler=(.+)/),
    inlineSpoiler: initFormat(["ISPOILER"], /(?<!\\)\|\|/),
    alignment: initCodeFormat(["RIGHT", "LEFT"], /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(?:right|center)?/, /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(right|center)/),
    color: initColorFormat(["COLOR"], /(?<!\\)%(#[a-fA-F0-9]{6})?%/, /.*%(#[a-fA-F0-9]{6})%.*/),
  };
  // Posts button: div.formButtonGroup-primary > button:first-child
  // Threads button: div.formSubmitRow-controls > button:first-child
  function submitEvent() {
    const submitBtn = document.querySelector("div.formSubmitRow-controls > button:first-child")
      || document.querySelector("div.formButtonGroup-primary > button:first-child");
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

  function alignParse(format) {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    for (let i = 0; i < format.indexes.length; i++) {
      format.type = getType(format, textBoxEl, i) ?? format.type;
      // Removes ```
      const alignTag = format.type === "right" ? format.tags[0] : format.tags[1];
      textBoxEl.children[format.indexes[i]].outerHTML = "<p></p>";
      if (!format.tagIndex) {
        let lineTxt = textBoxEl.children[format.indexes[i] + 1].innerHTML;
        lineTxt = `[${alignTag}]${lineTxt}`;
        textBoxEl.children[format.indexes[i] + 1].outerHTML = `<p>${lineTxt}</p>`;
        format.tagIndex = 1;
      } else {
        let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
        lineTxt = `${lineTxt}[/${format.tags[0]}]`;
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}</p>`;
        format.tagIndex = 0;
      }
    }
    format.indexes.length = 0;
  }

  function codeParse(format) {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    for (let i = 0; i < format.indexes.length; i++) {
      let type = getType(format, textBoxEl, i);
      // Removes ```
      textBoxEl.children[format.indexes[i]].outerHTML = "<p></p>";
      if (!format.tagIndex) {
        let lineTxt = textBoxEl.children[format.indexes[i] + 1].innerHTML;
        lineTxt = `[${format.tags[0]}${type ? `=${type}` : ""}]${lineTxt}`;
        textBoxEl.children[format.indexes[i] + 1].outerHTML = `<p>${lineTxt}</p>`;
        format.tagIndex = 1;
      } else {
        let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
        lineTxt = `${lineTxt}[/${format.tags[0]}]`;
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}</p>`;
        format.tagIndex = 0;
      }
    }
    format.indexes.length = 0;
  }

  function quoteParse() {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
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
    const lineIndent = lineTxt.match(/&nbsp;/g)?.length ?? 0;
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
        lineTxt = lineTxt.replace(list.regex, `[${format.tags[2]}]`);
      }
      format.indentLevel = lineIndent;
    }
    return lineTxt;
  }

  function colorParse(lineTxt, format) {
    while (lineTxt.search(format.regex) !== -1) {
      if (!format.tagIndex) {
        format.type = lineTxt.replace(format.colorRegex, "$1");
        lineTxt = lineTxt.replace(format.regex, `[${format.tags[0]}=${format.type}]`);
        format.tagIndex = 1;
      } else {
        lineTxt = lineTxt.replace(format.regex, `[/${format.tags[0]}]`);
        format.tagIndex = 0;
      }
    }
    // Make sure there's an equal number of open to closed tag ratio.
    let openTagsAmount = lineTxt.replaceAll(`[${format.tags[0]}=${format.type}]`, '@A@').match(/@A@/g)?.length ?? 0;
    let closedTagsAmount = lineTxt.replaceAll(`[/${format.tags[0]}]`, '@B@').match(/@B@/g)?.length ?? 0;
    if (openTagsAmount > closedTagsAmount) {
      lineTxt = `${lineTxt}[/${format.tags[0]}]`;
    } else if (closedTagsAmount > openTagsAmount) {
      lineTxt = `[${format.tags[0]}=${format.type}]${lineTxt}`;
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

  function parse(lineTxt, i) {
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
    lineTxt = lineSubParse(lineTxt, formats["link"]);
    lineTxt = fullLineParse(lineTxt, formats["header1"]);
    lineTxt = fullLineParse(lineTxt, formats["header2"]);
    lineTxt = fullLineParse(lineTxt, formats["header3"]);
    lineTxt = listParse(lineTxt, formats["list"]);
    return lineTxt;
  }

  function parseMarkdown() {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    for (let i = 0; i < textBoxEl.children.length; i++) {
      const lineEl = textBoxEl.children[i];
      if (lineEl.innerHTML === "<br>") {
        continue;
      }
      lineEl.outerHTML = "<p>" + parse(lineEl.innerHTML, i) + "</p>";
    }
    quoteParse();
    codeParse(formats["code"]);
    codeParse(formats["spoiler"]);
    alignParse(formats["alignment"]);
  }

  function createButton() {
    const btnLayer = document.querySelector("div.formButtonGroup-primary,div.formSubmitRow-controls");
    if (!btnLayer) return;
    const btn = Edexal.newEl({element: 'button', type: 'button', class:['button']});
    const spanText = Edexal.newEl({element: 'span', class:['button-text'], text: "PARSE MD", style: "color: yellow;"});
    btn.append(spanText);
    Edexal.onEv(btn, 'click', parseMarkdown);
    btnLayer.prepend(btn);
  }

  createButton();
})()