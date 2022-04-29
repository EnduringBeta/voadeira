// JS code for extension options menu popup

const switchText = "⛵ Switch to amazon.";
const urlStem = "https://amazon.";

const switchButton = document.getElementById("button-switch");
const selectOne = document.getElementById("select-first-site");
const selectTwo = document.getElementById("select-second-site");

chrome.storage.sync.get(["websitePair", "allTlds"], (storageObjects) => {
  updateButton(storageObjects.websitePair);
  storageObjects.allTlds.forEach(tld => {
    const optionOne = document.createElement("option");
    optionOne.value = tld;
    optionOne.innerText = tld;
    const optionTwo = optionOne.cloneNode(true);

    // If current option is first or second TLD in active pair, select it
    // and don't add to the other select element. Otherwise add option to
    // both select elements.
    if (storageObjects.websitePair[0] === tld) {
      optionOne.setAttribute("selected", "");
      selectOne.appendChild(optionOne);
    } else if (storageObjects.websitePair[1] === tld) {
      optionTwo.setAttribute("selected", "");
      selectTwo.appendChild(optionTwo);
    } else {
      selectOne.appendChild(optionOne);
      selectTwo.appendChild(optionTwo);
    }
  });
});

// TODO: detect which site and show/switch to other one, or just point to first
function updateButton(pair) {
  switchButton.innerText = switchText + pair[0];
  switchButton.addEventListener("click", async () => {
    window.open(urlStem + pair[1] + "/test", '_blank');
  });
}
