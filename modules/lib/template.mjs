function getEnvValue(envVar) {
  return envVar ? envVar : '-';
}

function getTemplate(env) {
  return `// ==UserScript==
// @name        -
// @namespace   ${getEnvValue(env.NAMESPACE)}
// @match       ${getEnvValue(env.MATCH_URL)}
// @license     ${getEnvValue(env.LICENSE)}
// @version     ${getEnvValue(env.START_VERSION)}
// @author      ${getEnvValue(env.AUTHOR)}
// @description -
// ==/UserScript==`;
}

export {getTemplate};