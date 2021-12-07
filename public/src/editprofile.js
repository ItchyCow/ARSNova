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
import { connectStorageEmulator } from '@firebase/storage';

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


function getUserFromFirestore(uid) {
    var docRef = doc(db, "user", uid)
    var docSnap = getDoc(docRef).then((snapshot) => {
        // Code here 
        // attribute = value.data().attribute

        document.getElementById("bio_ID").value = snapshot.data().bio
        document.getElementById("year_level").value = snapshot.data().year_level
        document.getElementById("course").value = snapshot.data().course
        console.log("adasd")
        return snapshot

    })
}

function updateUsertoFirestore(uid) {
    updateDoc(doc(db, "user", uid), {
        course: document.getElementById("course").value,
        bio: document.getElementById("bio_ID").value,
        year_level: document.getElementById("year_level").value
    })
    console.log(document.getElementById("bio_ID").value)
}


getUserFromFirestore("XrCKsAwS3yejfB0g9a1Zmjv6Y812")

document.getElementById("save_btn").onclick = function() {updateUsertoFirestore("XrCKsAwS3yejfB0g9a1Zmjv6Y812")}
