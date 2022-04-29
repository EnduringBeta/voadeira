// JS code for running automatically on particular sites
// as defined in manifest.json

chrome.storage.sync.get(["replace", "wordPairs"],
  (storageObjects) => {
    if (!storageObjects.replace) {
      console.log("Bomblaster inactive");
      return;
    }

    let pageHTML = document.body.innerHTML;
    storageObjects.wordPairs.forEach((pair) => {
      console.log(pair.search + " -> " + pair.replace);
    });

    walkText(document.body, storageObjects.wordPairs);

    // https://stackoverflow.com/posts/34559316/revisions
    function walkText(node, wordPairs) {
      if (node == null) {
        return;
      } else if (wordPairs.length < 1) {
        return;
      }

      if (node.nodeType == 3) {
        wordPairs.forEach((pair) => {
          node.data = node.data.replace(
            // Case-insensitive comparison requires
            // both upper and lowercase pairs
            new RegExp(pair.search, "g"), pair.replace
          );
        });
      }
      if (node.nodeType == 1 && node.nodeName != "SCRIPT") {
        for (let i = 0; i < node.childNodes.length; i++) {
          walkText(node.childNodes[i], wordPairs);
        }
      }
    }
  }
);
