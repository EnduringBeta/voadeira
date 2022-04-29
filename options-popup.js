// JS code for extension options menu popup

const activeText = "Stop It";
const inactiveText = "Spill the Beans";

const toggleButton = document.getElementById("button-toggle");

chrome.storage.sync.get("replace", ({ replace }) => {
  updateButton(replace);
});

// TODO: apply/remove changes on button click
toggleButton.addEventListener("click", async () => {
  chrome.storage.sync.get("replace", ({ replace }) => {
    replace = !replace;
    updateButton(replace);
    chrome.storage.sync.set({ replace });
  });
});

function updateButton(active) {
  toggleButton.innerText = active ? activeText : inactiveText;
  if (active) {
    toggleButton.classList.add("active");
  } else {
    toggleButton.classList.remove("active");
  }
}
