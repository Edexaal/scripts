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

function setAnswer(obj, questionObj, key, answer) {
  if (!answer || !answer.trim()) {
    obj[key] = questionObj[key].default || '-';
  } else {
    obj[key] = answer;
  }
}

function formatQuestion(questionObj, key) {
  return `${questionObj[key].query} setting: ${questionObj[key].default ? "(" + questionObj[key].default + ")" : ""}`;
}

const questions = {
  SCRIPT_TYPE: {query: "Script type", default: "f95"},
  SCRIPT_NAME: {query: '@name'},
  NAMESPACE: {query: '@namespace'},
  MATCH_URL: {query: '@match'},
  ICON_URL: {query: '@icon'},
  LICENSE: {query: '@license', default: 'Unlicense'},
  START_VERSION: {query: '@version', default: '0.1.0'},
  AUTHOR: {query: '@author'},
  SUPPORT_URL: {query: '@supportURL'},
  DESCRIPTION: {query: '@description'}
};

async function getMetadata() {
  const rl = await getReader();
  const metadata = {};
  for (const key in questions) {
    if (key === "SCRIPT_TYPE") {
      const answer = await askQuestion(rl, formatQuestion(questions, key));
      setAnswer(metadata, questions, key, answer.toLowerCase())
    } else {
      const answer = await askQuestion(rl, formatQuestion(questions, key));
      setAnswer(metadata, questions, key, answer);
    }
  }
  rl.close();
  return metadata;
}

export {getMetadata};