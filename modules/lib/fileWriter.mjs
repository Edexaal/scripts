import {writeFile, mkdir} from 'node:fs/promises';
import {join} from 'node:path';

async function createScript(data, metadata) {
  await mkdir(metadata.SCRIPT_TYPE, {recursive: true});
  let fileName = metadata.SCRIPT_NAME.replace(/ /, '-').toLowerCase();
  if (fileName.startsWith(metadata.SCRIPT_TYPE)){
    fileName = fileName.slice(metadata.SCRIPT_TYPE.length + 1);
  }
  const fileLoc = join(metadata.SCRIPT_TYPE, `${fileName}.user.js`);
  await writeToFile(fileLoc, data);
}

async function writeToFile(filePath, data) {
  try {
    await writeFile(filePath, data);
  } catch (e) {
    console.error(e.cause);
  }
}

export {createScript};