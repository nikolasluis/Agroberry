import { 
    getAuth,
    onAuthStateChanged,
    signOut 
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let email = '';

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
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
    if (user) {
      //window.location.href = "../pages/cont.html";
      email = user.email;
      console.log(user)
      show();
    }
    else {
      console.log("not logged in")
      window.location.href = "../pages/login.html";
    }
})
function show(){
    document.getElementById("user").innerHTML = email
    console.log(email);
}

function signout(){
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("signOut successful")
    window.location.href = "../pages/login.html";
  }).catch((error) => {
    console.log("signOut unsuccessful", error)
  });
}

signoutIndex.addEventListener("click",signout)

