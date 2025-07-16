// Firebase config and setup
const firebaseConfig = {
  apiKey: "AIzaSyDQoaoxyfEfBM1UKlxUh-K4RXqA74HBbT0",
  authDomain: "smartbelt-calculator.firebaseapp.com",
  projectId: "smartbelt-calculator",
  storageBucket: "smartbelt-calculator.firebasestorage.app",
  messagingSenderId: "727785940721",
  appId: "1:727785940721:web:0ee546333ef4936f0eab50",
  measurementId: "G-KDC6625JCQ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Login
document.getElementById('login')?.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => alert('Logged in!'))
    .catch(err => alert('Login error: ' + err.message));
});

// Signup
document.getElementById('signup')?.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert('Account created!');
      window.location.href = 'index.html'; // change path if needed
    })
    .catch(err => alert('Signup error: ' + err.message));
});


// Logout
document.getElementById('logout')?.addEventListener('click', () => {
  auth.signOut().then(() => alert('Logged out!'));
});

// Toggle UI
auth.onAuthStateChanged((user) => {
  const isLoggedIn = !!user;
  document.getElementById('logout')?.style?.setProperty('display', isLoggedIn ? 'inline-block' : 'none');
  document.getElementById('login')?.style?.setProperty('display', isLoggedIn ? 'none' : 'inline-block');
  document.getElementById('signup')?.style?.setProperty('display', isLoggedIn ? 'none' : 'inline-block');

  if (isLoggedIn) {
    console.log("User logged in:", user.email);
  } else {
    console.log("No user logged in");
  }
});
