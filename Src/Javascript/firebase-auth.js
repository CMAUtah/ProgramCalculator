// Firebase config and setup
const firebaseConfig = {
  apiKey: "AIzaSyDQoaoxyfEfBM1UKlxUh-K4RXqA74HBbT0",
  authDomain: "smartbelt-calculator.firebaseapp.com",
  projectId: "smartbelt-calculator",
  storageBucket: "smartbelt-calculator.appspot.com",
  messagingSenderId: "727785940721",
  appId: "1:727785940721:web:0ee546333ef4936f0eab50",
  measurementId: "G-KDC6625JCQ"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function showMessage(text, isError = true) {
  const msgEl = document.getElementById('message');
  if (msgEl) {
    msgEl.textContent = text;
    msgEl.style.color = isError ? 'red' : 'green';
  }
}

// Login
document.getElementById('login')?.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showMessage('Logged in!', false);
      setTimeout(() => window.location.href = 'index.html', 1000);
    })
    .catch(err => showMessage('Login error: ' + err.message));
});

// Signup
document.getElementById('signup')?.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showMessage('Account created!', false);
      setTimeout(() => window.location.href = 'index.html', 1000);
    })
    .catch(err => showMessage('Signup error: ' + err.message));
});

// Logout
document.getElementById('logout')?.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      showMessage('Logged out!', false);
      setTimeout(() => window.location.href = 'login.html', 1000);
    });
});


// Toggle UI on login.html only
if (window.location.pathname.includes('login')) {
  auth.onAuthStateChanged((user) => {
    const isLoggedIn = !!user;
    document.getElementById('logout')?.style?.setProperty('display', isLoggedIn ? 'inline-block' : 'none');
    document.getElementById('login')?.style?.setProperty('display', isLoggedIn ? 'none' : 'inline-block');
    document.getElementById('signup')?.style?.setProperty('display', isLoggedIn ? 'none' : 'inline-block');

    console.log(isLoggedIn ? `User logged in: ${user.email}` : 'No user logged in');
  });
}

document.getElementById('resetPasswordLink')?.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent page reload
  const email = document.getElementById('email').value.trim();

  if (!email) {
    showMessage('Please enter your email first.');
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => showMessage('Password reset email sent!', false))
    .catch(err => showMessage('Reset error: ' + err.message));
});
