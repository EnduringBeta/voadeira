// JS code for running automatically on particular sites
// as defined in manifest.json

chrome.storage.sync.get(["websitePair"],
  (storageObjects) => {
    if (storageObjects.websitePair.length !== 2) {
      console.warn("Website Pair doesn't have exactly 2 entries!\r\n" + storageObjects.websitePair);
      return;
    }

    console.log(storageObjects.websitePair[0] + " <-> " + storageObjects.websitePair[1]);

    // TODO: get path and/or product name
    console.log(document.URL);
  }
);
