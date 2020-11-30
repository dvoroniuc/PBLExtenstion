document.addEventListener(
  'DOMContentLoaded',
  () => {
    const getDataItem = () => document.querySelector('#item').value;

    const newMessage = () => {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, getDataItem());
      });
    };
    document.querySelector('button').addEventListener('click', newMessage);
  },
  false
);
