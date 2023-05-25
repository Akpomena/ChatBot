const { dockStart } = require('@nlpjs/basic');
const axios = require("axios");
const say = require("say");

function speechFunction(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.log('Speech recognition is not supported by this browser.');
} else {
  const recognition = new SpeechRecognition();

  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log(transcript);
  };

  recognition.onerror = (event) => {
    console.error(event.error);
  };

  recognition.start();
}

}

const getJoke = async () => {
  var joke = "No joke";

  const options = {
    method: 'GET',
    url: 'https://jokeapi-v2.p.rapidapi.com/joke/Any',
    params: {
      format: 'json',
      type: 'twopart',
      idRange: '0-150',
      blacklistFlags: 'nsfw,racist'
    },
    headers: {
      'X-RapidAPI-Key': '824b209d43mshb9b5bf14d82102dp1c06fdjsn5a6ebf845a26',
      'X-RapidAPI-Host': 'jokeapi-v2.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const data = response.data;
    joke = data.setup + "\n\n" + data.delivery;
  } catch(error) {
    console.log(error);
  }

  return joke;

}

  const getAnswer = async (question) => {
    var answer = "answer";
  
   const options = {
  method: 'POST',
  url: 'https://gpt-based-google-search.p.rapidapi.com/search',
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': '824b209d43mshb9b5bf14d82102dp1c06fdjsn5a6ebf845a26',
    'X-RapidAPI-Host': 'gpt-based-google-search.p.rapidapi.com'
  },
  data: `{"question":"${question}"}`
};
  

  try {
    const response = await axios.request(options);
    answer = response.data.data;
  } catch(error) {
    console.log(error);
  }

  return answer;
}

async function onIntent(nlp, input) 
{
  if (input.intent === "joke.randomjoke")
  {
    const output = input;
    output.answer = await getJoke();
  }

  if (input.intent === "greetings.time")
  {
    const output = input;
    output.answer = input.utterance + " to you!!";
  }

  if (input.intent === "user.search")
  {
    const output = input;
    output.answer = await getAnswer(input.utterance);
  }


 // const pause = await say.speak(input.answer);
  
  return input;
}





 async function response(prompt)
  {
    const dock = await dockStart({ use: ['Basic']});
    const nlp = dock.get('nlp');
    await nlp.addCorpus('./corpus-en.json');
    await nlp.train();
    nlp.onIntent = onIntent;
    const response = await nlp.process('en', prompt);
    
    return response;
  }

  module.exports = {response}