import { async } from '@firebase/util';
import { initializeApp } from 'firebase/app'
import {
    getAuth, sendPasswordResetEmail
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
const auth = getAuth()

const modal = document.getElementById('myModal')

const emailReset = document.querySelector('.inptstuff')
emailReset.addEventListener('submit', (e) => {
    e.preventDefault()
    
    let flag = true
    sendPasswordResetEmail(auth, emailReset.email.value)
        .catch((err) => {
            if (err.code === 'auth/user-not-found') {
                flag = false
                displayMissing()
                emailReset.reset()
            }
        })
        .then(() => {
            if(flag) {
                goBack()
            }
        })
})

function displayMissing() {
    document.getElementById('incorrect').innerHTML = "Email not found. Please double-check your email."
}

async function goBack() {
    modal.style.display = 'block'
    clearMissing()
    await new Promise(resolve => setTimeout(resolve, 2000))
    window.location = 'index.html'
}

function clearMissing() {
    document.getElementById('incorrect').innerHTML = ''
}