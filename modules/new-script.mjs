import {getTemplate} from "#lib/template.mjs";
import {writeToFile} from "#lib/fileWriter.mjs";
import {loadScriptEnv} from "#lib/cli.mjs";

try {
  const scriptType = await loadScriptEnv();
  const template = getTemplate();
  await writeToFile(template, scriptType);
} catch (e) {
  console.error("Error: " + e.message);
}
