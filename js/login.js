import {
    txtEmail,
    txtPassword,
} from '../js/query.js';

import { 
    getAuth,
    onAuthStateChanged, 
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence

 } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdPF0BwopXQUycQBNpsvnAl5Gc-SBzTSU",
  authDomain: "projeto-8f398.firebaseapp.com",
  projectId: "projeto-8f398",
  storageBucket: "projeto-8f398.appspot.com",
  messagingSenderId: "279540596068",
  appId: "1:279540596068:web:3bb200b3160fbd53284e71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const createAccount = async () => {
    const email = txtEmail.value
    const password = txtPassword.value
  
    setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        createUserWithEmailAndPassword(auth, email, password)
        console.log("account created")

    })
}
 
const loginEmailPassword = async () => {
    const loginEmail = txtEmail.value
    const loginPassword = txtPassword.value

    setPersistence(auth, browserSessionPersistence)
    .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
        signInWithEmailAndPassword(auth, loginEmail, loginPassword);

    })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("Não foio possivel encontrar sua conta")
  });
  
    // step 1: try doing this w/o error handling, and then add try/catch
    //await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  
    // step 2: add error handling
    // try {
    //   await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    // }
    // catch(error) {
    //   console.log(`There was an error: ${error}`)
    //   showLoginError(error)
    // }
}

const monitorAuthState = async () => {
    onAuthStateChanged(auth, user => {
      if (user) {
        window.location.href = "../index.html";
        console.log("logged in")
        

      }
      else {
        console.log("not logged in")
      }
    })
}
  
const auth = getAuth(app);
login.addEventListener("click",loginEmailPassword)
register.addEventListener("click", createAccount)
monitorAuthState();

  