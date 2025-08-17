import {writeFile, mkdir} from 'node:fs/promises';
import {join} from 'node:path';

async function writeToFile(data, scriptDir) {
  await mkdir(scriptDir, {recursive: true});
  const fileLoc = join(scriptDir, '_new.js');
  try {
    await writeFile(fileLoc, data);
  } catch (e) {
    console.error(e.cause);
  }
}

export {writeToFile};