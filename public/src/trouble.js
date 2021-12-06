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

const emailReset = document.querySelector('.inptstuff')
emailReset.addEventListener('submit', (e) => {
    sendPasswordResetEmail(auth, emailReset.email.value)    
})