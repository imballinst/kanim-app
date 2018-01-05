require('dotenv').config();

const {
  getMainPage,
  postLogin,
  postListKanim,
  postCheckSession,
  postAvailabilityInfo,
} = require('./lib/requests');

// Main
let cookieContainer;
let tokenContainer;
let kanimsContainer;

getMainPage().then((res) => {
  cookieContainer = res.headers['set-cookie'][0].split(';')[0].split('=')[1];

  return postLogin(cookieContainer);
}).then((res) => {
  const parsedJSON = JSON.parse(res.data);
  tokenContainer = parsedJSON.Token;

  return postListKanim(cookieContainer);
}).then((res) => {
  kanimsContainer = res.data.Offices;

  const kanimID = 20;
  const startDate = '2018-1-4';
  const endDate = '2018-3-5';

  return postAvailabilityInfo(cookieContainer, tokenContainer, kanimID, startDate, endDate);
}).then((res) => {
  // console.log(res.data);
}).catch((err) => {
  console.log(err);
});
