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

import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

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

//global vars
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('editevent_pp')
        console.log('user status changed:', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
        console.log('user not signed in')
    }
})

//custom functions
function getProfileImageUrl(destination) {
    var location = "images/" + userID
    console.log(location)
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

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

// collection ref
const colRef = collection(db, 'event')

 // real time collection data  
 onSnapshot(colRef, (snapshot) => {
    let event = []
    snapshot.docs.forEach((doc) => {
        event.push({ ...doc.data(), id: doc.id})
    })
    console.log(event)
})

const eventID = sessionStorage.getItem('eventID')
console.log(eventID)

function getEventFromFirestore(uid) {
    var docRef = doc(db, "event", uid)
    var docSnap = getDoc(docRef).then((snapshot) => {
        // Code here 
        // attribute = value.data().attribute
        document.getElementById("name").value = snapshot.data().name
        document.getElementById("location").value = snapshot.data().location
        document.getElementById("type").value = snapshot.data().type
        document.getElementById("fine").value = snapshot.data().fine
        document.getElementById("time_start").value = snapshot.data().time_start
        document.getElementById("time_end").value = snapshot.data().time_end
        document.getElementById("date").value = snapshot.data().date
        document.getElementById("availability").value = snapshot.data().availability

        console.log("adasd")
        return snapshot

    })
}

getEventFromFirestore(eventID)

const saveChanges = document.querySelector('.edit')
saveChanges.addEventListener('submit', (e) => {
    e.preventDefault()

    let docRef = doc(db,'event', eventID)
    updateDoc(docRef, {
        name: document.getElementById("name").value,
        location: document.getElementById("location").value,
        type: document.getElementById("type").value,
        fine: document.getElementById("fine").value,
        time_start:  document.getElementById("time_start").value,
        time_end: document.getElementById("time_end").value,
        date: document.getElementById("date").value,
        availability: document.getElementById("availability").value
    })
    .then(() => {
        window.location = 'eventsummary.html'
    })
})

var QRCode = require('qrcode')
var canvas = document.getElementById('qrcode')

QRCode.toCanvas(canvas, 'sample text', function (error) {
    if (error) console.log(error)
    console.log('Success on QRCode!')
})

/*
// qrcode functions
function getProfileImageUrl(destination) {
    var location = "qrcodes/" + userID
    console.log(location)
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}
*/