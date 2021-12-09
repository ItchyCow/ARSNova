import { initializeApp } from 'firebase/app'
import {
    getFirestore, onSnapshot,
    doc
} from 'firebase/firestore'
import {
    getAuth,
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBMjNRz6ccicva3bAuQ07MN-xniNSCk0_A",
    authDomain: "ccs6-b084d.firebaseapp.com",
    projectId: "ccs6-b084d",
    storageBucket: "ccs6-b084d.appspot.com",
    messagingSenderId: "741143261047",
    appId: "1:741143261047:web:42557543c4d2a0cf0c7b72",
    measurementId: "G-KQ9QHRVZLG"
};

//init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()
const auth = getAuth()

var userID
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.psw.value

    signInWithEmailAndPassword(auth, email, password)
        .catch((err) => {
            if (err.code === 'auth/wrong-password') {
                displayIncorrect()
            } else if (err.code === 'auth/user-not-found') {
                displayMissing()
            } else {
                console.log(err.message)
            }
        })
        .then((cred) => {
            userID = cred.user.uid
            checkAuthority()
        })
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        checkAuthority()
    }
    else {
        console.log('user not signed in')
    }
})

function displayIncorrect() {
    document.getElementById('incorrect').innerHTML = "Sorry, your password was incorrect. Please double-check your password."
}

function displayMissing() {
    document.getElementById('incorrect').innerHTML = "Email not found. Please double-check your email."
}

function displayNoAuth() {
    document.getElementById('incorrect').innerHTML = "Only Admin-type users may sign in!"
    loginForm.reset() 
}

function checkAuthority() {
    const dataRef = doc(db, 'user', userID)
    onSnapshot(dataRef, (doc) => {
        if (doc.data().type === 'admin') {
            window.location = 'homepage.html'
        } else {
            signOut(auth)
                .then(() => {
                    displayNoAuth()
                })
        }
    })
}