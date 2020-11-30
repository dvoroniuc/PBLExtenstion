const newMessage = (message, sender, sendResponse) => {
  console.log(sender);
  console.log(sendResponse);
  const inputs = document.querySelectorAll(`input`);
  const textAreas = document.querySelectorAll(`textarea`);

  const matched = [...inputs, textAreas];

  matched.map((a) => {
    a.value === message
      ? (a.style.border = 'thick solid red')
      : (a.style.border = '');
  });
};

chrome.runtime.onMessage.addListener(newMessage);
