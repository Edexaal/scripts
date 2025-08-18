import process from 'node:process';

function getEnvValue(envVar) {
  return envVar ? envVar : '-';
}

function getTemplate() {
  const env = process.env;
  return `// ==UserScript==
// @name        ${getEnvValue(env.SCRIPT_NAME)}
// @namespace   ${getEnvValue(env.NAMESPACE)}
// @match       ${getEnvValue(env.MATCH_URL)}
// @grant       none
// @icon        ${getEnvValue(env.ICON_URL)}
// @license     ${getEnvValue(env.LICENSE)}
// @version     ${getEnvValue(env.START_VERSION)}
// @author      ${getEnvValue(env.AUTHOR)}
// @description -
// @homepageURL -
// @supportURL  ${getEnvValue(env.SUPPORT_URL)}
// @require     -
// ==/UserScript==
(async() =>{

})()`;
}

export {getTemplate};