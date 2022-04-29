// background.js
// Initializing JS code for this Chrome extension

// Initial array with Amazon extensions to swap between
// This should never have a length other than 2
let websitePair = ["com", "co.uk"];
// Array with all known top-level domains for Amazon (www.amazon.???)
// and their respective country names
let allTlds = [
  {"tld": "com", "nation": "USA"},
  {"tld": "com.br", "nation": "Brazil"},
  {"tld": "ca", "nation": "Canada"},
  {"tld": "cn", "nation": "China"},
  {"tld": "eg", "nation": "Egypt"},
  {"tld": "fr", "nation": "France"},
  {"tld": "de", "nation": "Germany"},
  {"tld": "in", "nation": "India"},
  {"tld": "it", "nation": "Italy"},
  {"tld": "co.jp", "nation": "Japan"},
  {"tld": "mx", "nation": "Mexico"},
  {"tld": "nl", "nation": "Netherlands"},
  {"tld": "pl", "nation": "Poland"},
  {"tld": "sa", "nation": "Saudi Arabia"},
  {"tld": "sg", "nation": "Singapore"},
  {"tld": "es", "nation": "Spain"},
  {"tld": "se", "nation": "Sweden"},
  {"tld": "com.tr", "nation": "Turkey"},
  {"tld": "ae", "nation": "UAE"},
  {"tld": "co.uk", "nation": "UK"}
];

// https://developer.chrome.com/docs/extensions/mv3/getstarted/#background-script
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ websitePair });
  chrome.storage.sync.set({ allTlds });
});
