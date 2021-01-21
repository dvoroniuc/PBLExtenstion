let showLoginForm;
let showRegisterForm;

let JWTToken = '';
let CSRFToken = '';

let loginFormTemplate;
let registerFormTemplate;
let sensitiveDataForm;

let loginForm;
let registerForm;

let isDisabled = false;

let userEmail;

document.addEventListener(
  'DOMContentLoaded',
  () => {
    getCSRFToken();
    
    loginFormTemplate = document.getElementById('logIn');
    loginFormTemplate.setAttribute('style', 'display:none');
    
    registerFormTemplate = document.getElementById('register');
    registerFormTemplate.setAttribute('style', 'display:none');
    
    sensitiveDataForm = document.getElementById('addSensitiveData');
    sensitiveDataForm.setAttribute('style', 'display:none');

    document.getElementById('openRegisterFormButton').addEventListener('click', openRegisterForm)
    document.getElementById('openLoginFormButton').addEventListener('click', openLoginForm)

    document.getElementById('turnOnOff').addEventListener('click', ()=> {
      if(isDisabled){
        enableEverything();
      } else {
        disableEverything();
      }
    });

    // On LOGIN BUTTON CLICK
    document.getElementById('signInButton').addEventListener('click', () => {
      const credentials = {
        email:  document.querySelector('#signInForm input[name="email"]').value,
        password: document.querySelector('#signInForm input[name="password"]').value,
      }

      authorize(credentials).then((data) => {
        JWTToken = data.token;
        userEmail = credentials.email;
        showAddSensitiveDataForm();
      }, (error)=> {
        console.error(error);
        document.querySelector('#signInForm input[name="email"]').setAttribute('style', 'border: 1px solid red');
        document.querySelector('#signInForm input[name="password"]').setAttribute('style', 'border: 1px solid red');
      });
    });

    // ON Register button click
    document.getElementById('registerButton').addEventListener('click', () => {
      const credentials = {
        email:  document.querySelector('#registerForm input[name="email"]').value,
        password: document.querySelector('#registerForm input[name="password"]').value,
      }

      register(credentials).then(() => {
        authorize(credentials).then((data) => {
          JWTToken = data.token;
          userEmail = credentials.email;
          showAddSensitiveDataForm();
        });
      }, ()=> {
        
        document.querySelector('#signInForm input[name="email"]').setAttribute('style', 'border: 1px solid red');
        document.querySelector('#signInForm input[name="password"]').setAttribute('style', 'border: 1px solid red');
        document.querySelector('#signInForm input[name="password2"]').setAttribute('style', 'border: 1px solid red');
      });
    });

    // Open right template based on JWT token
    if (!JWTToken) {
      showLoginForm = true;
      loginFormTemplate.setAttribute('style', 'display:block');
    } else {
      showAddSensitiveDataForm();
    }

    const getDataItem = () => document.querySelector('#item').value;

    const newMessage = () => {
      postData({
        email: userEmail,
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
      if (!data.length) {
        document.getElementById('no-items').setAttribute('style', 'display:block');
      }
      
      if (getDataItem() !== '' && !data.includes(getDataItem())) {
        data.push(getDataItem());
        document.getElementById('no-items').setAttribute('style', 'display:none');
        
        var node = document.createElement("LI");

        var textnode = document.createTextNode(getDataItem());
        node.appendChild(textnode);
        fields.appendChild(node);

        document.querySelector('#error').style.display = 'none';
        document.querySelector('#item').value = '';
      } else {
        document.querySelector('#error').style.display = 'block';
      }
    };

    document.querySelector('#item').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addData();
      }
  });
    document.querySelector('#send').addEventListener('click', newMessage);
  },
  false
)

async function postData(data = {}) {
  const response = await fetch('https://localhost:8081/api/user', {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFToken,
      'Authorization': 'Bearer ' + JWTToken,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
  return await response.json();
}

function openRegisterForm() {
  showLoginForm = false;
  loginFormTemplate.setAttribute('style', 'display: none');

  showRegisterForm = true;
  registerFormTemplate.setAttribute('style', 'display: block');

}

function disableEverything() {
  isDisabled = true;

  loginFormTemplate.setAttribute('style', 'display: none');
  registerFormTemplate.setAttribute('style', 'display: none');
  sensitiveDataForm.setAttribute('style', 'display:none');
  document.getElementById('turnOnOffText').innerHTML='Disabled'
}

function enableEverything() {
  isDisabled = false;
  document.getElementById('turnOnOffText').innerHTML='Enabled';

  if(JWTToken) {
    sensitiveDataForm.setAttribute('style', 'display:block');
    return;
  }

  loginFormTemplate.setAttribute('style', 'display: block');
  registerFormTemplate.setAttribute('style', 'display: none');
  sensitiveDataForm.setAttribute('style', 'display:none');
}

function openLoginForm() {
  showLoginForm = true;
  loginFormTemplate.setAttribute('style', 'display: block');

  showRegisterForm = false;
  registerFormTemplate.setAttribute('style', 'display: none');
}

async function authorize(credentials) {
  const response = await fetch('https://localhost:8081/auth/sign-in', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFToken,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(credentials),
  });
  return await response.json();
}

async function register(credentials) {
  const response = await fetch('https://localhost:8081/auth/sign-up', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': CSRFToken,
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(credentials),
  }).then((err)=>console.log(err));
  return await response.json();
}

function showAddSensitiveDataForm() {
  showLoginForm = false;
  showRegisterForm = false;
  loginFormTemplate.setAttribute('style', 'display:none');
  registerFormTemplate.setAttribute('style', 'display:none');
  sensitiveDataForm.setAttribute('style', 'display:block');
}

function getCSRFToken() {
  fetch('https://localhost:8081/auth/_csrf',  {method: "GET"})
  .then((data)=> {
    const reader = data.body.getReader();

    reader.read().then((data)=> {
      var string = new TextDecoder("utf-8").decode(data.value);
      CSRFToken = JSON.parse(string).csrf_token;
    });

  }, (error) => {
    console.log('error')
  })
}