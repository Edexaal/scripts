import readline from 'node:readline/promises';
import process from 'node:process';
import {join} from 'node:path';

async function getReader() {
  return await readline.createInterface({
    input: process.stdin,
    output: process.stout
  });
}

async function getScriptType(rl) {
  const question = "What script to create? (f95,lc,default)";
  console.log(question);
  return await rl.question(question);
}

function loadEnv(fileName) {
  let dir = join('.', fileName);
  process.loadEnvFile(dir);
}

async function loadScriptEnv() {
  const rl = await getReader();
  const scriptType = await getScriptType(rl);
  rl.close();
  loadEnv('.env');
  switch (scriptType) {
    case 'f95':
      loadEnv('.env.f95');
      break;
    case 'lc':
      loadEnv('.env.lc');
      break;
    default:
      return 'other';
  }
  return scriptType;
}

export {loadScriptEnv};