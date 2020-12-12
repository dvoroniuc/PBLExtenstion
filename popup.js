let showLoginForm;
let showRegisterForm;

let JWTToken = '';
let CSRFToken = '';

let loginFormTemplate;
let registerFormTemplate;
let sensitiveDataForm;

let loginForm;
let registerForm;

let isLoading = false;

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

    // On LOGIN BUTTON CLICK
    document.getElementById('signInButton').addEventListener('click', () => {
      const credentials = {
        email:  document.querySelector('#signInForm input[name="email"]').value,
        password: document.querySelector('#signInForm input[name="password"]').value,
      }

      authorize(credentials).then((data) => {
        console.log(data);
        // JWTToken = !!!!!!!!!!!!!!!!
        showAddSensitiveDataForm();
      }, ()=> {
        console.log('rejected')
        JWTToken = 'test';
        showAddSensitiveDataForm();
      });
    })

    // ON Register button click
    document.getElementById('registerButton').addEventListener('click', () => {
      const credentials = {
        email:  document.querySelector('#registerForm input[name="email"]').value,
        password: document.querySelector('#registerForm input[name="password"]').value,
      }

      register(credentials).then((data) => {
        console.log(data);
        authorize(credentials).then((data) => {
          console.log(data);
          // JWTToken = !!!!!!!!!!!!!!!!
          JWTToken = 'test';
          showAddSensitiveDataForm();
    
        });
      }, ()=> {
        console.log('rejected');
        JWTToken = 'test';

        showAddSensitiveDataForm();
      });
    })


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
      if (!data.length) {
        document.getElementById('no-items').setAttribute('style', 'display:block');
      }
      
      if (getDataItem() !== '') {
        data.push(getDataItem());
        document.getElementById('no-items').setAttribute('style', 'display:none');
        
        var node = document.createElement("LI");
        console.log(getDataItem());
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
);

async function postData(data = {}) {
  const response = await fetch('http://localhost:8081/api/user', {
    method: 'POST',
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
  console.log('openRegisterForm')

  showLoginForm = false;
  loginFormTemplate.setAttribute('style', 'display: none');

  showRegisterForm = true;
  registerFormTemplate.setAttribute('style', 'display: block');

}

function openLoginForm() {
  showLoginForm = true;
  loginFormTemplate.setAttribute('style', 'display: block');

  showRegisterForm = false;
  registerFormTemplate.setAttribute('style', 'display: none');
}

async function authorize(credentials) {
  const response = await fetch('http://localhost:8081/auth/sign-in', {
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
    body: credentials,
  });
  return await response.json();
}

async function register(credentials) {
  const response = await fetch('http://localhost:8081/auth/sign-up', {
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
    body: credentials,
  });
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
  fetch('https://localhost:8081/auth/_csrf').then((data)=> {
    console.log(data)
    CSRFToken = data.csrf_token;
  })
}