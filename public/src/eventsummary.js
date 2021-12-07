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

//global vars
const eventRef = collection(db, 'event')
const q = query(eventRef, orderBy('name', 'asc'))
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('evsum_pp')
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

onSnapshot(q, (snapshot) => {
    let event = []
    snapshot.docs.forEach((doc) => {
        event.push({ ...doc.data()})
    })
    resetTable()
    for (var i in event) {
        displayToTable(event[i])
        //console.log(event[i].name)
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

function displayToTable(event) {
    let avail
    if (event.availability === true) {
        avail = 'Available'
    } else {
        avail = 'Not Available'
    }

    var codeBlock = "<td><input type='checkbox'></td>" +
                    "<td>" + event.name + "</td>" +
                    "<td>" + event.date + "</td>" +
                    "<td>" + event.time_start + "</td>" +
                    "<td>" + event.time_end + "</td>" +
                    "<td>" + event.location + "</td>" +
                    "<td>" + event.fine + "</td>" +
                    "<td>" + avail + "</td>"
    document.getElementById('eventsdata').innerHTML += codeBlock
}

function resetTable() {
    document.getElementById('eventsdata').innerHTML = ""
}