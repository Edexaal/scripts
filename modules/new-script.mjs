import process from 'node:process';
import {getTemplate} from "./lib/template.mjs";
import {writeToFile} from "./lib/fileWriter.mjs";

try {
  process.loadEnvFile('.env');
  const template = getTemplate(process.env);
  await writeToFile(template, '_lib');
} catch (e) {
  console.error("Error: " + e.message);
}
