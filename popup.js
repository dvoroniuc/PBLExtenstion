async function postData(data = {}) {
  const response = await fetch('http://localhost:8081/api/user', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
  return await response.json();
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const getDataItem = () => document.querySelector('#item').value;

    const newMessage = () => {
      postData({
        email: 'email',
        password: 'password',
        personalData: data,
      }).then((data) => {
        chrome.tabs.query(
          { currentWindow: true, active: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data);
          }
        );
      });
    };

    const data = [];
    const addData = () => {
      if (getDataItem() !== '') {
        data.push(getDataItem());
        document.querySelector('#error').style.display = 'none';
        document.querySelector('#item').value = '';

        const fields = document.querySelector('#fields');
        const field = data.map((v) => {
          return `${v} <br/>`;
        });
        fields.innerHTML = field;
      } else {
        document.querySelector('#error').style.display = 'block';
      }
    };
    document.querySelector('#add').addEventListener('click', addData);
    document.querySelector('#send').addEventListener('click', newMessage);
  },
  false
);
