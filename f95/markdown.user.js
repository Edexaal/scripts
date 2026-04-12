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
// @version     1.2.2
// @author      Edexal
// @description Use markdown syntax in threads, posts, and conversations.
// @homepageURL https://sleazyfork.org/en/scripts/566411-f95-markdown
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// ==/UserScript==
(async () => {
  const MARKDOWN_PATH = "/markdown";
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

  function initSpoilerFormat(tags,regex,startRegex,typeRegex,endBlockStr) {
    return {tags, regex,startRegex, typeRegex, endBlockStr,indexes: []};
  }

  function initColorFormat(tags, startRegex,endRegex, colorRegex) {
    return {tags, startRegex, endRegex,colorRegex};
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
      code: initSpoilerFormat(["CODE"], /^(?:\s|&nbsp;)*```/,/^(?:\s|&nbsp;)*```/, /^(?:\s|&nbsp;)*```(.+)/, "```"),
      header1: initHeader(["SIZE=7", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)#(?!#)(?:\s|&nbsp;)*/),
      header2: initHeader(["SIZE=6", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)##(?!#)(?:\s|&nbsp;)*/),
      header3: initHeader(["SIZE=5", "SIZE"], /^(?:\s|&nbsp;)*(?<!\\)###(?:\s|&nbsp;)*/),
      list: initListFormat(["LIST", "LIST=1", "*"], /^(?:\s|&nbsp;)*-(?:\s|&nbsp;)*/, /^(?:\s|&nbsp;)*\d+\.(?:\s|&nbsp;)*/),
      spoiler: initSpoilerFormat(["SPOILER"], /^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*(?:spoiler)?/,/^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*spoiler/, /^(?:\s|&nbsp;)*:{3}(?:\s|&nbsp;)*spoiler=(.+)/,":::"),
      inlineSpoiler: initFormat(["ISPOILER"], /(?<!\\)\|\|/),
      alignment: initSpoilerFormat(["RIGHT", "CENTER"], /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(?:right|center)?/,/^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(?:right|center)/, /^(?:\s|&nbsp;)*(?:&lt;){3}(?:\s|&nbsp;)*(right|center)/,"&lt;&lt;&lt;"),
      color: initColorFormat(["COLOR"], /(?<!\\)%#[a-fA-F0-9]{6}%/, /(?<!\\)%{2}/,/%(#[a-fA-F0-9]{6})%/),
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

  function blockParse(format) {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    for (let i = 0; i < format.indexes.length; i++) {
      let type = getType(format, textBoxEl, i);
      if (type || !!textBoxEl.children[format.indexes[i]].innerHTML.match(format.startRegex)) {
        let tag = `[${format.tags[0]}${type ? `=${type}` : ""}]`;
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${tag}</p>`;
      }else {
        let tag = `[/${format.tags[0]}]`;
        let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
        lineTxt = lineTxt.replace(format.endBlockStr,"");
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}${tag}</p>`;
      }
    }
    format.indexes.length = 0;
  }
  function alignParse(format) {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    for (let i = 0; i < format.indexes.length; i++) {
      format.type = getType(format, textBoxEl, i) ?? format.type;
      const alignTag = format.type === "right" ? format.tags[0] : format.tags[1];
      if (!!textBoxEl.children[format.indexes[i]].innerHTML.match(format.startRegex)) {
        let tag = `[${alignTag}]`;
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${tag}</p>`;
      }else {
        let tag = `[/${alignTag}]`;
        let lineTxt = textBoxEl.children[format.indexes[i]].innerHTML;
        lineTxt = lineTxt.replace(format.endBlockStr,"");
        textBoxEl.children[format.indexes[i]].outerHTML = `<p>${lineTxt}${tag}</p>`;
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
      lineTxt = lineTxt.replace(format.colorRegex,`[COLOR=$1]`);
    } else if (!!lineTxt.match(format.endRegex)){
      lineTxt = lineTxt.replace(format.endRegex,"[/COLOR]");
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

  function parseMarkdown(textBoxEl) {
    formats = defaultFormats();
    let lastIndex = 0;
    for (let i = 0; i < textBoxEl.children.length; i++) {
      const lineEl = textBoxEl.children[i];
      if (lineEl.innerHTML === "<br>") {
        continue;
      }
      let openingTag = "<p>";
      let closingTag = "</p>";
      if (lineEl.outerHTML.includes("text-align: center")) {
        openingTag = '<p style="text-align: center;">';
      } else if (lineEl.outerHTML.includes("text-align: right")) {
        openingTag = '<p style="text-align: right;">';
      }

      lineEl.outerHTML = openingTag + parse(lineEl.innerHTML, i) + closingTag;
      lastIndex = i;
    }
    quoteParse();
    blockParse(formats["code"]);
    blockParse(formats["spoiler"]);
    alignParse(formats["alignment"]);
    textBoxEl.children[lastIndex].outerHTML = "<p>" + endListParse(textBoxEl.children[lastIndex].innerHTML, formats["list"]) + "</p>";
  }

  function createButton(btnLayer, textboxEl) {
    const btn = Edexal.newEl({element: 'button', type: 'button', class: ['button']});
    const spanText = Edexal.newEl({element: 'span', class: ['button-text'], text: "PARSE MD", style: "color: yellow;"});
    btn.append(spanText);
    Edexal.onEv(btn, 'click', () => parseMarkdown(textboxEl));
    btnLayer.prepend(btn);
  }

  function applyButton(records, observer, shouldDisconnect) {
    for (const record of records) {
      for (const addedNode of record.addedNodes) {
        if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;
        const buttonLayer = addedNode.querySelector("div.formButtonGroup-primary,div.formSubmitRow-controls");
        const textBoxEl = addedNode.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
        const toolbarEl = addedNode.querySelector("div.fr-toolbar");
        if (!buttonLayer || !textBoxEl || !toolbarEl) continue;
        createButton(buttonLayer, textBoxEl);
        applyhelpBtn(toolbarEl);

        if (shouldDisconnect) {
          observer.disconnect();
        }
      }
    }
  }

  function buttonObserver(elToObserve, shouldDisconnect) {
    const obs = new MutationObserver((records, observer) => applyButton(records, observer, shouldDisconnect));
    obs.observe(document.querySelector(elToObserve), {subtree: true, childList: true});
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
    const span = Edexal.newEl({element: "span", class: ["fr-sr-only"], text: "Markdown syntax"})
    button.append(i, span)
    button.addEventListener("click", helpBtnClickEvent);
    return button;
  }
  function createToolbarSeparator() {
    return Edexal.newEl({element:"div",role:"separator","aria-orientation":"vertical"});
  }

  function applyhelpBtn(toolbarEl) {
    const helpBtn = createhelpToolbarBtn();
    const separatorEl = createToolbarSeparator();
    toolbarEl.append(separatorEl,helpBtn);
  }

  function markdownPage() {
    const mainBodyEl = document.querySelector("div.p-body-content");
    // Removes all child elements
    mainBodyEl.querySelector("div.blockMessage").remove();
    //Removes Header
    document.querySelector("div.uix_headerContainer").remove();
    // Removes footer
    document.querySelector("footer").remove();
    // Change site title
    document.querySelector("head title").textContent = "F95 Markdown Syntax";
    const titleEl = document.querySelector("h1.p-title-value");
    titleEl.textContent = "F95 Markdown Syntax";
    mainBodyEl.innerHTML = `
<div id="md-toc">
    <ul>
        <a href="#md-bold"><li>Bold</li></a>
        <a href="#md-italics"><li>Italic</li></a>
        <a href="#md-strikethrough"><li>Strikethrough</li></a>
        <a href="#md-inline-code"><li>Inline Code</li></a>
        <a href="#md-headings"><li>Headings</li></a>
        <a href="#md-link"><li>Link</li></a>
        <a href="#md-block-quote"><li>Block Quote</li></a>
        <a href="#md-code-block"><li>Code Block</li></a>
        <a href="#md-lists"><li>Lists</li></a>
        <a href="#md-underline"><li>Underline</li></a>
        <a href="#md-named-quotes"><li>Named Quotes</li></a>
        <a href="#md-inline-spoiler"><li>Inline Spoiler</li></a>
        <a href="#md-spoiler"><li>Spoiler</li></a>
        <a href="#md-alignment"><li>Alignment</li></a>
        <a href="#md-color"><li>Color</li></a>
    </ul>
</div>
<hr/>
<h3 id="md-bold">Bold</h3>

<p>Makes text <strong>BOLD</strong>.</p>

<pre><code>// Syntax: **&lt;text&gt;**
This is **a dummy** text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\**a dummy\\** text
</code></pre>
<hr>
<h3 id="md-italics">Italic</h3>

<p>Makes text <em>italic</em>.</p>

<pre><code>// Syntax: _&lt;text&gt;_
This is _a dummy_ text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\_a dummy\\_ text.
</code></pre>
<hr>
<h3 id="md-strikethrough">Strikethrough</h3>

<p>Strikethrough a <del>selection</del> of text.</p>

<pre><code>// Syntax: ~~&lt;text&gt;~~
This is ~~a dummy~~ text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\~~a dummy\\~~ text.
</code></pre>
<hr>
<h3 id="md-inline-code">Inline Code</h3>

<p>Place text in <code>monospace</code> code font.</p>

<pre><code>// Syntax: \`&lt;text&gt;\`
This is \`a dummy\` text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\\`a dummy\\\` text.
</code></pre>
<hr>
<h3 id="md-headings">Headings</h3>

<p>You can use headings <em>only up to level 3</em> (<code>###</code>).</p>

<pre><code>// Syntax: #&lt;text&gt;
# Level 1
## Level 2
### Level 3
</code></pre>
<hr>
<h3 id="md-link">Link</h3>

<p>Create a link to a <a href="https://sleazyfork.org/" rel="nofollow">URL</a></p>

<pre><code>// Syntax: [&lt;text to represent link&gt;](&lt;link to a URL&gt;)
This is [a dummy](https://sleazyfork.org) text.
</code></pre>
<hr>
<h3 id="md-block-quote">Block Quote</h3>

<blockquote>
<p>Create a generic block quote. </p>
</blockquote>

<pre><code>// Syntax: &gt;&lt;text&gt;
&gt; This is a dummy text.
&gt; Another dummy text!
&gt; 
&gt; Hey! You saw that gap?!?
</code></pre>
<hr>
<h3 id="md-code-block">Code Block</h3>

<pre><code>// Syntax: 
// \`\`\`
// &lt;text&gt;
// \`\`\`

\`\`\`
This is a dummy text inside a code block.
\`\`\`

// You can also specify a coding language.
// Syntax: 
// \`\`\`&lt;language to use&gt;
// &lt;text&gt;
// \`\`\`

\`\`\`python
variable = 10
min = 20

def func(x,y):
    return x + y * x
\`\`\`
</code></pre>
<hr>
<h3 id="md-lists">Lists</h3>

<p>Unordered &amp; Ordered lists are supported!</p>

<pre><code>// Ordered lists
// Syntax: &lt;digits&gt;. 
1. Wake up
2. Look at a mirror
3. Shower

// Unordered lists
// Syntax: -&lt;text&gt;
- Atemoya
- Avocado
- Alupag

// You can mix them and apply descendents. Each child indent level is 2 spaces.
1. This is a dummy text
  - I'm the dummy's child
  - Me too!
    1. Look! I'm a grandchild
    2. Me too, Brother!

- I'm a parent like dummy there.
  1. A number child
    - I'm number's child
  2. Number's lost sibling 
</code></pre>
<hr>
<h3 id="md-underline">Underline</h3>

<p>Apply <u>underline</u> to a string of text.</p>

<pre><code>// Syntax: __&lt;text&gt;__
This is __a dummy__ text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\__a dummy\\__ text.
</code></pre>
<hr>
<h3 id="md-named-quotes">Named Quotes</h3>

<p>Same as <em>Block Quote</em> except new you can quote someone or something. </p>

<pre><code>// Syntax: &gt;&gt; &lt;Any words can be typed here&gt;
// NOTE: The first quote must use \`&gt;&gt;\`. Afterwards, use regular block quote, \`&gt;\`.

&gt;&gt; Johan Capri
&gt; Hello everyone!
&gt; Don't forget to like, subscribe, and hit that notification bell to 
&gt; always be up to date on the latest news!
</code></pre>
<hr>
<h3 id="md-inline-spoiler">Inline Spoiler</h3>

<p>Blur out some text.</p>

<pre><code>// Syntax: ||&lt;text&gt;||
This is ||a dummy|| text.

// Can be escaped using \`\\\` to prevent parsing.
This is \\||a dummy\\|| text.
</code></pre>
<hr>
<h3 id="md-spoiler">Spoiler</h3>

<p>Hide a block of text behind a a.</p>

<pre><code>// Syntax:
// ::: spoiler
// &lt;text&gt;
// :::

::: spoiler
This is a dummy text.
:::

// You can also provide a description for the spoiler a
// Syntax:
// ::: spoiler=&lt;name of spoiler&gt;
// &lt;text&gt;
// :::

::: spoiler=Please do not open this spoiler!
This is a dummy text.
:::
</code></pre>
<hr>
<h3 id="md-alignment">Alignment</h3>

<p>Align text either <code>center</code> or <code>right</code>.</p>

<pre><code>// Syntax:
// &lt;&lt;&lt; &lt;right or center&gt;
// &lt;text&gt;
// &lt;&lt;&lt;

&lt;&lt;&lt; center
This is a dummy text.
&lt;&lt;&lt;

//Here's a right alignment example.
&lt;&lt;&lt; right
This is a dummy text.
&lt;&lt;&lt;
</code></pre>
<hr>
<h3 id="md-color">Color</h3>

<p>Apply hexidecimal color to <span style="color: green;">text</span>.</p>

<pre><code>// Syntax: 
// %&lt;#six-digit hexidecimal color code&gt;% &lt;text&gt; %%

This is %#ff03ff%a dummy%% text. 

// Escape using '\\%' on the end and start tags.

This is \\%#ff03ff%a dummy\\%% text. 
</code></pre>
    `;
  }

  // Program Start
  if (location.pathname !== MARKDOWN_PATH) {
    Edexal.addCSS(CSS_TOOLBAR);
    // The first textbox element found
    setTimeout(() => {
      createButton(document.querySelector("div.formButtonGroup-primary,div.formSubmitRow-controls"), document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]"));
      applyhelpBtn(document.querySelector("div.fr-toolbar"));
    }, 1000);
    // Edit Posts
    buttonObserver("div.block-container[data-lb-id]");
  }else {
    Edexal.addCSS(CSS_MARKDOWN_PAGE);
    markdownPage();
  }
})()