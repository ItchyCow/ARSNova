import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, Unsubscribe,
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
    getDownloadURL, deleteObject
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
var viewuserID = sessionStorage.getItem('userID')
const userRef = doc(db, 'user', viewuserID)
var userID

//firebase functions
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid
        getProfileImageUrl('profile_pp', userID)
        const dataRef = doc(db, 'user', userID)
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
        })
    }
    else {
        window.location = 'index.html'
    }
})

onSnapshot(userRef, (doc) => {
    let user = doc.data()

    displayUserData(user)
    getProfileImageUrl('view_pp', viewuserID)
})

//customfunctions
function getProfileImageUrl(destination, ID) {
    var location = "images/" + ID
    getDownloadURL(ref(storage, location))
        .then((url) => {
            document.getElementById(destination).src = url
        })
}

function displayUserData(vu) {
    let balance = parseFloat(vu.fines) - parseFloat(vu.incentives)
    let status
    if (vu.clearance_status === true) {
        status = 'CLEARED'
    } else {
        status = 'NOT CLEARED'
    }

    document.getElementById('nameuser').innerHTML = vu.fname + " " + vu.mi + ". " + vu.lname
    document.getElementById('yrlvl').innerHTML = vu.course + "-" + vu.year_level
    document.getElementById('useremail').innerHTML = vu.email
    document.getElementById('type').innerHTML = vu.type
    document.getElementById('bio').innerHTML = vu.bio
    document.getElementById('incentives').innerHTML = vu.incentives
    document.getElementById('balance').innerHTML = balance
    document.getElementById('status').innerHTML = status
}