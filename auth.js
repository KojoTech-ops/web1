// TAB SWITCH
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");


loginTab.addEventListener("click", () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginForm.classList.add("form-active");
  signupForm.classList.remove("form-active");
});

signupTab.addEventListener("click", () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupForm.classList.add("form-active");
  loginForm.classList.remove("form-active");
});

// initialize
loginForm.classList.add("form-active");


if (loginTab && signupTab) {

  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  });

  signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

}

// Front-end simulation for login/signup
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

loginBtn.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  if(email && pass) {
    localStorage.setItem('loggedIn', 'true');
    window.location.href = 'dashboard.html'; // Redirect to dashboard
  } else {
    alert('Please enter email and password');
  }
});

signupBtn.addEventListener('click', () => {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const pass = document.getElementById('signupPassword').value;
  if(name && email && pass) {
    alert('Signup successful! Please login.');
  } else {
    alert('Please fill all fields.');
  }
});


