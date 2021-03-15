const Discord = require("discord.js");
const config = require("./config.json");
const googleTrends = require('google-trends-api');
const needle = require('needle');
const format = require('string-format');
format.extend(String.prototype, {});
let {PythonShell} = require('python-shell')

const client = new Discord.Client();
client.login(config.BOT_TOKEN);

let intervalId = null;

//first word of this needs to be common - will be used as the baseline for comparing others
let wordList = ['stocks', 'VGX', 'Voyager Token', 'Bitcoin'];
let cooldownList = {};
//last10MinsTweets = [];

// Date.prototype.toIsoString = function() {
//     var tzo = -this.getTimezoneOffset(),
//         dif = tzo >= 0 ? '+' : '-',
//         pad = function(num) {
//             var norm = Math.floor(Math.abs(num));
//             return (norm < 10 ? '0' : '') + norm;
//         };
//     return this.getFullYear() +
//         '-' + pad(this.getMonth() + 1) +
//         '-' + pad(this.getDate()) +
//         'T' + pad(this.getHours()) +
//         ':' + pad(this.getMinutes()) +
//         ':' + pad(this.getSeconds()) +
//         dif + pad(tzo / 60) +
//         ':' + pad(tzo % 60);
// }

function checkCooldown() {
  for(var key of Object.keys(cooldownList)) {
    if(cooldownList[key] == 0) { //fully cooled down, re-add to wordList
      wordList.push(key);
      delete cooldownList[key];
      //last10MinsTweets.push(getLast10Mins(key));
    } else if(cooldownList[key] == 14) {
      const index = wordList.indexOf(key);
      wordList.splice(index,1);
      //last10MinsTweets.splice(index,1);
      cooldownList[key] = cooldownList[key] - 1;
    } else { //decrement
      cooldownList[key] = cooldownList[key] - 1;
    }
  }
}

//-------------------------------------------TWITTER CODE (currently deprecated)--------------------
// async function fillTweets() {
//   last10MinsTweets.push([0]);
//   for(let e = 1; e < wordList.length; e++) {
//     last10MinsTweets.push(await getLast10Mins(wordList[e]));
//   }
// }
// async function getLast10Mins(wordName) {
//   Date.prototype.toIsoString = function() {
//       var tzo = -this.getTimezoneOffset(),
//           dif = tzo >= 0 ? '+' : '-',
//           pad = function(num) {
//               var norm = Math.floor(Math.abs(num));
//               return (norm < 10 ? '0' : '') + norm;
//           };
//       return this.getFullYear() +
//           '-' + pad(this.getMonth() + 1) +
//           '-' + pad(this.getDate()) +
//           'T' + pad(this.getHours()) +
//           ':' + pad(this.getMinutes()) +
//           ':' + pad(this.getSeconds()) +
//           dif + pad(tzo / 60) +
//           ':' + pad(tzo % 60);
//   }
//   const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent';
//   let start = new Date();
//   start.setMinutes(start.getMinutes() - 12);
//   let end = new Date();
//   end.setMinutes(end.getMinutes() - 10);
//   let tempArr = []
//   for(let z = 0; z < 5; z++) { //10-8, 8-6, 6-4, 4-2, 2-0
//     start.setMinutes(start.getMinutes() + 2);
//     end.setMinutes(end.getMinutes() + 2);
//     if(z ==  4) {
//       start = new Date();
//       start.setMinutes(start.getMinutes() - 2);
//       end = new Date();
//     }
//     const params = {
//       'end_time' : end.toIsoString(),
//       'query' : wordName,
//       'start_time' : start.toIsoString()
//     }
//     const res = await needle('get', endpointUrl, params, {headers : {
//       "authorization" : `Bearer ${config.BEARER}`
//     }})
//     if(res.body) {
//       let response = res.body.data;
//       if(response == undefined) {
//         tempArr.push(0);
//       }
//       else if(response.length > 0) {
//         let numTweets = 0;
//         for(let y = 0; y < response.length; y++) {
//           numTweets++;
//         }
//         tempArr.push(numTweets);
//       } else {
//         tempArr.push(0);
//       }
//     } else {
//       throw new Error ('Unsuccessful request.');
//     }
//   }
//   console.log("temp arr is {}", tempArr);
//   return tempArr;
// }
//
// async function twitterWork() {
//   for(let p = 0; p < wordList.length; p++) {
//     const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent';
//     let start = new Date();
//     start.setMinutes(start.getMinutes() - 2);
//     tempwordName = wordList[p];
//     const params = {
//       'query' : tempwordName,
//       'start_time' : start.toIsoString()
//     }
//     const res = await needle('get', endpointUrl, params, {headers : {
//       "authorization" : `Bearer ${config.BEARER}`
//     }})
//     if(res.body) {
//       let response = res.body.data;
//       if(response != undefined) {
//         let numTweets = 0;
//         for(let j = 0; j < response.length; j++) {
//           numTweets++;
//         }
//         last10MinsTotal = 0;
//         for(var i in last10MinsTweets[p]) { last10MinsTotal += last10MinsTweets[p][i]; }//get sum of  array
//         if(numTweets > last10MinsTotal) {
//           //alert and add to cooldown with 15
//           console.log("Tweet alert found for {} with {} tweets recently.".format(wordList[p], numTweets));
//           let message = "ALERT: For {}, {} tweets in last 2 mins compared to {} in recently.".format(wordList[p], numTweets, last10MinsTotal);
//           const channel = client.channels.cache.find(channel => channel.name === "monitoring");
//           //channel.send(message);
//           if(numTweets > 1) {
//             //channel.send(response[0].text.toString());
//             //channel.send(response[1].text.toString());
//           }
//           cooldownList[wordList[p]] = 15; //add to cooldown
//         }
//         last10MinsTweets[p].shift();
//         last10MinsTweets[p].push(numTweets);
//         console.log("newl10: {}".format(last10MinsTweets[p]));
//       } else {
//         throw new Error ("Error in twitter response, undefined.");
//       }
//     } else {
//       throw new Error ('Unsuccessful request.');
//     }
//   }
// }
//-------------------------------------------END TWITTER CODE-----------------------------

async function trendsWork() {
  let startDate = new Date();
  startDate.setHours(startDate.getHours() - 2); //two hour window

  let optionsObject = {
    keyword : wordList,
    startTime : startDate,
    endTime : new Date(),
    geo : "US",
    granularTimeResolution : true
  }

  googleTrends.interestOverTime(optionsObject)
  .then(function(results){
    PythonShell.run('script.py', {args: [results, wordList]}, function(err, res) {
      if(err) {
        throw err;
      }
      let wordIterator = 1;
      for(let i = 0; i < res.length; i++) {
        if(i % 2 != 0) { //odd
          if(res[i].toString() != "Zero") { //here, we know trends are up
            console.log('ALERT FOUND FOR ' + wordList[wordIterator] + ': ', res[i].toString());
            let message = res[i].toString();
            const channel = client.channels.cache.find(channel => channel.name === "monitoring");
            channel.send(message);
            cooldownList[wordList[wordIterator]] = 15; //add to cooldown
          }
          wordIterator = wordIterator + 1;
        } else { //even
          console.log(res[i].toString());
        }
      }
    });
  })
  .catch(function(err){
    console.error('Error in trends API: ', err);
  });
  return true;
}

client.on('ready', () => {
  console.info('Logged in as ${bot.user.tag}!');
  (async() => {
    //await fillTweets();
    await pullTrends();
  })();
  intervalId = setInterval(pullTrends, 120000);
});

client.on('message', msg => {
  if(msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');
  }
  if(msg.content == '!stop') {
    client.destroy();
    return;
  }
});

async function pullTrends() {
  await checkCooldown(); //update cooldownList
  await trendsWork();
  //await twitterWork();
  console.log("Complete, wordList is now: ", wordList);
}
