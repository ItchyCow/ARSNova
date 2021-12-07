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

// adding documents
const addEventForm = document.querySelector('.edit')
editEventForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        name: editEventForm.name.value,
        location: editEventForm.location.value,
        type: editEventForm.type.value,
        fine: editEventForm.fine.value,
        //id: editEventForm.id.value,
        time_start: editEventForm.time_start.value,
        time_end: editEventForm.time_end.value,
        date: editEventForm.date.value,
        availability: editEventForm.availability.value,
        //code: addEventForm.code.value,
    })
    .then(() => {
        editEventForm.reset()
    })
})



async function editEventtoFirestore(availability, date, fine, location, name, time_end, time_start, type) {
    var docRef = await addDoc(collection(db, "event"), {
        availability: availability,
        date: date,
        fine: fine,
        location: location,
        name: name,
        time_end: time_end,
        time_start: time_start,
        type: type
    })

    await updateDoc(doc(db, "event", docRef.id), {
        qrcode: docRef.id
    })

    uploadQR(docRef.id)
    
}

/// Sample function calles
// document.getElementById("addevent_pp").src = getProfileImageUrl("yCLNQPosR3RUvKYd7tqOs73Rdc52")
// addEventtoFirestore(true, "07/06/21", 25, "Zoom", "Sample Event", "whole day", "whole day", "University")

