import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    doc, getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth, signOut,
    onAuthStateChanged
} from 'firebase/auth'
import {
    getStorage, ref,
    getDownloadURL
} from "firebase/storage";

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
const storage = getStorage()

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
        getUserFromFirestore(userID)
        console.log('user status changed:', userID)
        const dataRef = doc(db, 'user', userID)
        getProfileImageUrl('addevent_pp')
        onSnapshot(dataRef, (doc) => {
            document.getElementById('profname').innerHTML = doc.data().fname + " " + doc.data().lname + "<br>" + doc.data().email
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

//update user
function getUserFromFirestore(uid) {
    var docRef = doc(db, "user", uid)
    var docSnap = getDoc(docRef).then((snapshot) => {
        // Code here 
        // attribute = value.data().attribute

        document.getElementById("bio_ID").value = snapshot.data().bio
        document.getElementById("year_level").value = snapshot.data().year_level
        document.getElementById("course").value = snapshot.data().course
        document.getElementById("position").value = snapshot.data().position
        console.log("success")
        return snapshot

    })
}

function updateUsertoFirestore(uid) {
    updateDoc(doc(db, "user", uid), {
        course: document.getElementById("course").value,
        bio: document.getElementById("bio_ID").value,
        year_level: document.getElementById("year_level").value,
        position: document.getElementById("position").value
    })
    .then(() => {
        window.location = 'profilepage.html'
    })
    console.log(document.getElementById("bio_ID").value)
}


console.log(auth.currentUser)

document.getElementById("save_btn").onclick = function() {updateUsertoFirestore(userID)}
