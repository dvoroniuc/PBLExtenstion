async function getData(id) {
  const response = await fetch(`http://localhost:8081/api/user/${id}`, {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  });
  return await response.json();
}

const newMessage = (message, sender, sendResponse) => {
  console.log(sender);
  console.log(sendResponse);

  getData(message.id)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    });

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
