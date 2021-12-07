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

//global vars
var userID

  //init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()
const auth = getAuth()

//collection ref
const colRef = collection(db, 'user')

//real time collection data
onSnapshot(colRef, (snapshot) => {
    let user = []
    snapshot.docs.forEach((doc) => {
        user.push({ ...doc.data(), id: doc.id})
    })
    console.log(user)
})

var userID
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        console.log('user status changed:', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('nameuser').innerHTML = doc.data().fname + " " + doc.data().lname
            document.getElementById('nameusr').innerHTML = doc.data().fname + " " + doc.data().lname
            document.getElementById('profemail').innerHTML = user.email
            document.getElementById('useremail').innerHTML = user.email
            document.getElementById('position').innerHTML = doc.data().position
            document.getElementById('yrlvl').innerHTML = doc.data().year_level + " - " + doc.data().course
            document.getElementById('bio').innerHTML = doc.data().bio
        })
    }
    else {
        window.location = 'index.html'
        console.log('user not signed in')
    }
})

//logout
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

//view profile picture
function getProfileImageUrl(destination) {
    var location = "images/" + userID
    console.log(location)
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

