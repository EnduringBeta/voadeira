// background.js
// Initializing JS code for this Chrome extension

// Initial array with Amazon extensions to swap between
// This should never have a length other than 2
let websitePair = ["com", "co.uk"];
// Array with all known top-level domains for Amazon (www.amazon.???)
let allTlds = [
  "com",
  "com.au",
  "com.br",
  "ca",
  "cn",
  "eg",
  "fr",
  "de",
  "in",
  "it",
  "co.jp",
  "mx",
  "nl",
  "pl",
  "sa",
  "sg",
  "es",
  "se",
  "com.tr",
  "ae",
  "co.uk"
];

// https://developer.chrome.com/docs/extensions/mv3/getstarted/#background-script
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ websitePair });
  chrome.storage.sync.set({ allTlds });
});
