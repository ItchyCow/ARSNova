import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { 
    getStorage, ref, 
    getDownloadURL
} from "firebase/storage"


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
const storage = getStorage()

var userID
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        
        console.log('user status changed:', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname
            document.getElementById('profemail').innerHTML = user.email
        })
    }
    else {
        window.location = 'index.html'
        console.log('user not signed in')
    }
})

const logoutButton = document.querySelector('.lobtn')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('user signed out');
            window.location = 'index.html'
        })
        .catch(err => {
            console.log(err)
        })
})

function getProfileImageUrl(x) {
    var location = "images/" + x
    console.log(x)
    console.log(location)
    getDownloadURL(ref(storage, location))
        .then((url) => {
            console.log(url)
            return url
        })
        .catch((err) => {
            console.log(err)
        })
}

//document.getElementById('home_pp').src = getProfileImageUrl('yCLNQPosR3RUvKYd7tqOs73Rdc52')
document.getElementById('home_pp').src = "https://firebasestorage.googleapis.com/v0/b/ccs6-b084d.appspot.com/o/images%2FyCLNQPosR3RUvKYd7tqOs73Rdc52?alt=media&token=d5a76293-8277-4b8b-837f-529dac714464"