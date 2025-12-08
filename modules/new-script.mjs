import {getTemplate} from "#lib/template.mjs";
import {createScript} from "#lib/fileWriter.mjs";
import {getMetadata} from '#lib/asker.mjs'

try {
  const metadata = await getMetadata();
  const template = getTemplate(metadata);
  await createScript(template, metadata);
} catch (e) {
  console.error("Error: " + e.message);
}
