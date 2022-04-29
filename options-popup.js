// JS code for extension options menu popup

const switchText = "⛵ Switch to amazon.";
const urlStem = "https://amazon.";

const switchButton = document.getElementById("button-switch");
const selectOne = document.getElementById("select-first-site");
const selectTwo = document.getElementById("select-second-site");

const tlds = [];
const pair = [];

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

// Update switch button text
function updateSwitchButton() {
  switchButton.innerText = switchText + pair[0];
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
    option.value = tld;
    option.innerText = tld;
    if (tld === pair[curPairIndex]) {
      option.setAttribute("selected", "");
      selectEl.appendChild(option);
    } else if (tld !== pair[otherPairIndex]) {
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

// Open new tab at target website.
// TODO: detect current site and use opposite pair if match, otherwise pair[1]
function onSwitch(event) {
  window.open(urlStem + pair[1] + "/test", '_blank');
}

// Update [pair], save data, update button, and update other select element.
function onSelectChange(event) {
  pair[getSelectIndex(event.target)] = event.target.value;
  chrome.storage.sync.set({ websitePair: pair });
  console.log("Updated website pair to: " + pair);

  updateSwitchButton();
  updateSelect(getOtherSelect(event.target));
}
