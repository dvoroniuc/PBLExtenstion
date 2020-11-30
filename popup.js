document.addEventListener(
  "DOMContentLoaded",
  function () {
    document.querySelector("button").addEventListener("click", newMessage);

    function newMessage() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, getDataItem());
      });
    }

    function getDataItem() {
      return document.querySelector("#item").value;
    }
  },
  false
);
