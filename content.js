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

const getCommonItems = (array1, array2) => {
  let common = [];

  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] == array2[j]) {
        common.push(array1[i]);
      }
    }
  }

  return common;
};

const changeBorder = (element, to) => {
  element.style.borderColor = to;
};

const onWarning = (arr, elements) => {
  elements.forEach((element) => {
    if (arr.includes(element.value)) {
      element.style.border = 'thick solid red';
    }
  });
};

const onEmpty = (arr, elements) => {
  elements.forEach((element) => {
    if (!arr.includes(element.value)) {
      element.style.border = '';
    }
  });
};

async function newMessage(message, sender, sendResponse) {
  let timerId;
  clearInterval(timerId);

  const data = await getData(message.id);

  function dataArives() {
    const inputs = document.querySelectorAll(`input`);
    const textAreas = document.querySelectorAll(`textarea`);

    const matched = [
      ...[...inputs].map((val) => val.value),
      ...[...textAreas].map((val) => val.value),
    ];

    const commonItems = getCommonItems(matched, data.user.PersonalData);
    onWarning(commonItems, inputs);
    onWarning(commonItems, textAreas);
    onEmpty(commonItems, inputs);
    onEmpty(commonItems, textAreas);
  }
  timerId = setInterval(() => dataArives(), 500);
}

chrome.runtime.onMessage.addListener(newMessage);