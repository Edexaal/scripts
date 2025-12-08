import readline from 'node:readline/promises';

async function getReader() {
  return await readline.createInterface({
    input: process.stdin,
    output: process.stout
  });
}

async function askQuestion(rl, question) {
  console.log(question);
  return rl.question(question);
}

const questions = {
  SCRIPT_NAME: '@name',
  NAMESPACE: '@namespace',
  MATCH_URL: '@match',
  ICON_URL: '@icon',
  LICENSE: '@license',
  START_VERSION: '@version',
  AUTHOR: '@author',
  SUPPORT_URL:'@supportURL',
  DESCRIPTION: '@description'
};

async function getMetadata() {
  const rl = await getReader();
  const metadata = {};
  metadata.SCRIPT_TYPE = await askQuestion(rl,"What type of script? (f95)")
  metadata.SCRIPT_TYPE = metadata.SCRIPT_TYPE.toLowerCase();
  for(const key in questions){
    metadata[key] = await askQuestion(rl,questions[key]+' setting:');
  }
  rl.close();
  return metadata;
}

export {getMetadata};