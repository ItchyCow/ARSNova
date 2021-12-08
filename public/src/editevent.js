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
var eventIDQRCode

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('editevent_pp')
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

//custom functions
function getProfileImageUrl(destination) {
    var location = "images/" + userID
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
            window.location = 'index.html'
        })
        .catch(err => {
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
})

const eventID = sessionStorage.getItem('eventID')


var docRef = doc(db, "event", eventID)
getDoc(docRef)
    .then((snapshot) => {
        document.getElementById("name").value = snapshot.data().name
        document.getElementById("location").value = snapshot.data().location
        document.getElementById("type").value = snapshot.data().type
        document.getElementById("fine").value = snapshot.data().fine
        document.getElementById("time_start").value = snapshot.data().time_start
        document.getElementById("time_end").value = snapshot.data().time_end
        document.getElementById("date").value = snapshot.data().date
        document.getElementById("availability").value = snapshot.data().availability

        getQRCode('qrcode')
})

const saveChanges = document.querySelector('.edit')
saveChanges.addEventListener('submit', (e) => {
    e.preventDefault()

    let docRef = doc(db,'event', eventID)

    if (document.getElementById("availability").value === 'true') {
        var status = true
      } else {
         var status = false
      }

    var fine = parseFloat(document.getElementById("fine").value)

    updateDoc(docRef, {
        name: document.getElementById("name").value,
        location: document.getElementById("location").value,
        type: document.getElementById("type").value,
        fine: fine,
        time_start:  document.getElementById("time_start").value,
        time_end: document.getElementById("time_end").value,
        date: document.getElementById("date").value,
        availability: status
    })
    .then(() => {
        window.location = 'eventsummary.html'
    })
})

// qrcode functions
function getQRCode(destination) {
    var location = "qrcodes/" + eventID
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}
