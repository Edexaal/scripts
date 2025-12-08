
function getTemplate(meta) {
  return `// ==UserScript==
// @name        ${meta.SCRIPT_NAME}
// @namespace   ${meta.NAMESPACE}
// @match       ${meta.MATCH_URL}
// @grant       none
// @icon        ${meta.ICON_URL}
// @license     ${meta.LICENSE}
// @version     ${meta.START_VERSION}
// @author      ${meta.AUTHOR}
// @description ${meta.DESCRIPTION}
// @homepageURL -
// @supportURL  ${meta.SUPPORT_URL}
// @require     -
// ==/UserScript==
(async() =>{

})()`;
}

export {getTemplate};