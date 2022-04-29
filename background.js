// background.js
// Initializing JS code for this Chrome extension

// Boolean for whether extension operates
let replace = true;

// Initial words to search page contents for and replace
let wordPairs = [
  {
  	"search": "bombast",
  	"replace": "bomblast"
  },
  {
  	"search": "Bombast",
  	"replace": "Bomblast"
  },
];

// Initial wobsites where this extension will be active
// Note: moved to manifest.json, staticly defined
/*
let websites = [
  "https://www.polygon.com/",
  "https://kotaku.com/",
];
*/

// https://developer.chrome.com/docs/extensions/mv3/getstarted/#background-script
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ replace });
  chrome.storage.sync.set({ wordPairs });
  //chrome.storage.sync.set({ websites });
  //console.log("Loaded word replacement pairs");
  //console.log("Loaded word replacement websites: " + websites.join(", "));
});
