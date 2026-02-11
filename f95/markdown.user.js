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
// @description Create posts and threads in markdown.
// @homepageURL -
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// ==/UserScript==
(async () => {
  const textBoxEl = document.querySelector('div.fr-element');
  //'<p><em>Hello </em></p><p><br></p><p><u>The</u> <s>names</s> the&nbsp;</p><p><br></p><p><strong><span style="font-size: 18px;">games</span></strong></p><p><br></p><p><a href="https://google.com" target="_blank" rel="noopener noreferrer">gesgesg</a></p>'
  // Posts button: div.formButtonGroup-primary > button:first-child
  // Threads button: div.formSubmitRow-controls > button:first-child
  function submitEvent() {
    const submitBtn = document.querySelector("div.formSubmitRow-controls > button:first-child")
      || document.querySelector("div.formButtonGroup-primary > button:first-child");
  }

  function replace(line, regex, replacement) {
    return line.replaceAll(regex,replacement);
  }
  function parseAdvanced(lineTxt) {
    return lineTxt;
  }
  function parseIntermediate(lineTxt) {
   return lineTxt;
  }
  function parseBasic(lineTxt) {
    // Bold
    lineTxt = replace(lineTxt,/\*\*(.+?)\*\*/gi,"<strong>$1</strong>");
    // Italics
    lineTxt = replace(lineTxt,/_(.+?)_|\*([^*]+?[^*])\*/gi,"<em>$1</em>");
    // Strikethrough
    lineTxt = replace(lineTxt,/~~(.+?)~~/gi,"<s>$1</s>");
    // Link
    lineTxt = replace(lineTxt, /\[(.+?)]\((.+?)\)/gi,'<a href="$2">$1</a>');
    // Inline Code
    lineTxt = replace(lineTxt, /`(.+?)`/gi,'<code>$1</code>');
    return lineTxt;
  }

  function parseLine(lineTxt) {
    lineTxt = parseBasic(lineTxt);
    return lineTxt;
  }

  function parseMarkdown() {
    const textBoxEl = document.querySelector("div.bbWrapper div[spellcheck][class*=fr-element]");
    console.clear();
    for (const lineEl of textBoxEl.children) {
      if (lineEl.innerHTML === "<br>"){
        continue;
      }
      // lineEl.outerHTML = "<p>" + parseLine(lineEl.innerHTML) + "</p>";
      console.log("<p>" + parseLine(lineEl.innerHTML) + "</p>");
    }
  }
  function createButton() {
    const btnLayer = document.querySelector("div.formButtonGroup-primary,div.formSubmitRow-controls");
    if (!btnLayer) return;
    const btn = document.createElement('button');
    btn.append(document.createTextNode("TEST"));
    btn.addEventListener("click",parseMarkdown);
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