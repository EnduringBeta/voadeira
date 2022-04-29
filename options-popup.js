// JS code for extension options menu popup

const switchText = "⛵Switch to amazon.";
const amazonSig = "amazon";
const urlStem = "https://amazon.";
const searchStem = "/s?k=";
const errorQuery = "a[href='/ref=cs_404_link']";

const switchButton = document.getElementById("button-switch");
const selectOne = document.getElementById("select-first-site");
const selectTwo = document.getElementById("select-second-site");

const tlds = [];
const pair = [];

let currentUrl = null;
let switchUrl = "";
let xhttp = null;

init();

function init() {
  chrome.storage.sync.get(["websitePair", "allTlds"], (storageObjects) => {
    tlds.push(...storageObjects.allTlds);
    pair.push(...storageObjects.websitePair);
  
    updateSwitchButton();
    updateSelect(selectOne);
    updateSelect(selectTwo);
  });
  
  switchButton.addEventListener("click", onSwitch);
  selectOne.addEventListener("change", onSelectChange);
  selectTwo.addEventListener("change", onSelectChange);
}

// Update switch button text
function updateSwitchButton() {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs.length < 1) {
      console.error("Couldn't find current tab!");
      return null;
    }
    currentUrl = new URL(tabs[0].url);

    if (!currentUrl.hostname.includes(amazonSig)) {
      console.log("Not on an Amazon site, so not enabling button");
      return;
    }

    if (currentUrl.hostname.includes(pair[0])) {
      switchUrl = new URL(urlStem + pair[1] + currentUrl.pathname + currentUrl.search);
      switchButton.innerText = switchText + pair[1];
    } else if (currentUrl.hostname.includes(pair[1])) {
      switchUrl = new URL(urlStem + pair[0] + currentUrl.pathname + currentUrl.search);
      switchButton.innerText = switchText + pair[0];
    } else {
      switchUrl = new URL(urlStem + pair[1] + currentUrl.pathname + currentUrl.search);
      switchButton.innerText = switchText + pair[1];
    }

    // Change switchUrl to search if resulting page is a 404 or possibly
    // another issue
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = handleSwitchUrlCheck;
    xhttp.open("GET", currentUrl);
    xhttp.send();
  });
}

function enableSwitchButton() {
  switchButton.removeAttribute("disabled");
}

// If request sent in updateSwitchButton returns badly, change URL to search
// for the product on the page (based on URL name) rather than send user to
// bad page.
function handleSwitchUrlCheck() {
  if (xhttp.readyState !== XMLHttpRequest.DONE) {
    return;
  }

  let shouldChange = false;

  // If target page is bad in any way, change it
  if (xhttp.status !== 200) {
    shouldChange = true;
  } else if (xhttp.responseType === "document"
    && xhttp.response.querySelector(errorQuery) !== null) {
    shouldChange = true;
  } else if (xhttp.responseType === "" || xhttp.responseType === "text") {
    const parser = new DOMParser();
    const html = parser.parseFromString(xhttp.response, "text/html");
    if (html.querySelector(errorQuery) !== null) {
      shouldChange = true;
    }
  }
  
  if (shouldChange) {
    const splitPath = currentUrl.pathname.split("/");
    while (splitPath.length > 0 && splitPath[0].length < 1) {
      splitPath.shift();
    }
    if (splitPath.length < 1) {
      console.warn("Switch target path is empty, so nothing to search for");
      switchUrl = new URL(switchUrl.origin);
      return;
    }

    const searchTerms = splitPath[0].replaceAll("-", "+");
    switchUrl = new URL(switchUrl.origin + searchStem + searchTerms);
    console.log("Changed switch target to a search of the product name "
      + "because it didn't return a useful page:");
    console.log(switchUrl);
  }

  enableSwitchButton();
}

// Refresh options in [selectEl], marking selected option and removing
// other select element's selected option
function updateSelect(selectEl) {
  const curPairIndex = getSelectIndex(selectEl);
  const otherPairIndex = getSelectIndex(selectEl, true);
  if (curPairIndex === null || otherPairIndex === null) {
    console.error("Invalid select element to update: " + selectEl);
    return;
  }

  selectEl.innerHTML = "";

  // If current option is the selected one for this select, mark it so.
  // If current option is the selected one for the other select, skip it.
  // Otherwise add it.
  tlds.forEach(tld => {
    const option = document.createElement("option");
    option.value = tld.tld;
    option.innerText = `${tld.nation} (.${tld.tld})`;
    if (tld.tld === pair[curPairIndex]) {
      option.setAttribute("selected", "");
      selectEl.appendChild(option);
    } else if (tld.tld !== pair[otherPairIndex]) {
      selectEl.appendChild(option);
    }
  });
}

// Get select element that isn't [selectEl].
function getOtherSelect(selectEl) {
  switch (selectEl) {
    case selectOne:
      return selectTwo;
    case selectTwo:
      return selectOne;
    default:
      console.error("Invalid select element: " + selectEl);
      return null;
  }
}

// Return index into [pair] that represents [selectEl]'s selection.
// If [other] is true, return the index for the other select element.
function getSelectIndex(selectEl, other = false) {
  switch (selectEl) {
    case selectOne:
      return other ? 1 : 0;
    case selectTwo:
      return other ? 0 : 1;
    default:
      console.error("Invalid select element: " + selectEl);
      return -1;
  }
}

// Open new tab at target website (set in updateSwitchButton).
function onSwitch() {
  window.open(switchUrl.href, '_blank');
}

// Update [pair], save data, update button, and update other select element.
function onSelectChange(event) {
  pair[getSelectIndex(event.target)] = event.target.value;
  chrome.storage.sync.set({ websitePair: pair });
  console.log("Updated website pair to: " + pair);

  updateSwitchButton();
  updateSelect(getOtherSelect(event.target));
}
